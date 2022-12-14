import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import "./Learn.scss";
import Spinner from "../../components/Spinner/Spinner";
import HeaderLearnComponent from "../../components/Learn/Header/Header";
import Header from "../../components/Header/Header";
import NewWordFragment from "../../components/Learn/NewWordFragment/NewWordFragment";
import WriteWordFragment from "../../components/Learn/WriteWordFragment/WriteWordFragment";
import SessionComplete from "../../components/Learn/SessionComplete/SessionComplete";
import * as profileActions from "../../store/actions/profile";
import { BASE_URL } from "../../config/const";

const GOAL_SCORE = 2;
const TOTAL_TURNS = 10;

class Learn extends Component {
  state = {
    courseId: this.props.match.params.courseId,
    course: null,
    loading: true,
    index: 0,
    turns: TOTAL_TURNS,
    result: "learning",
    progress: null,
    sessionWords: null,
    wordsLearned: [],
    currentWord: null,
    courseFinished: false,
  };

  componentDidMount() {
    this.loadCourse();
    if (!this.props.profile.loading) {
      this.loadProgress();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (!this.props.profile.loading && prevProps.profile.loading) {
      this.loadProgress();
    }
    if (!this.sessionCreated && this.state.progress && this.state.course) {
      this.sessionCreated = true;
      this.createLearningSession();
    }
  }

  createLearningSession = (state = this.state) => {
    const course = state.course;
    const sessionWords = [];
    const wordsLearned = [];

    for (let pair of course.words) {
      let score = state.progress.wordsInProgress[pair.word] || 0;
      if (score !== GOAL_SCORE) {
        pair.score = score;
        sessionWords.push(pair);
      } else {
        wordsLearned.push(pair.word);
      }
    }

    if (sessionWords.length === 0) {
      this.props.history.goBack();
    } else {
      const currentWord = sessionWords[0];
      this.setState({
        loading: false,
        wordsLearned: wordsLearned,
        sessionWords: sessionWords,
        currentWord: currentWord,
      });
    }
  };

  loadProgress = (props = this.props) => {
    if (!props.profile.loading) {
      let progress = props.profile.progress[this.state.courseId];

      if (!progress) {
        progress = { wordsLearned: 0, wordsInProgress: {} };
      } else {
        progress = JSON.parse(JSON.stringify(progress));
      }
      this.setState({ progress: progress });
    }
  };

  loadCourse = () => {
    axios.defaults.xsrfCookieName = "csrftoken";
    axios.defaults.xsrfHeaderName = "X-CSRFToken";

    axios
      .get(BASE_URL + "courses-api/" + this.state.courseId + "/")
      .then((res) => {
        const course = res.data;
        course.words = JSON.parse(course.words);
        if (course.words.length === 0) {
          this.props.history.goBack();
        }
        this.setState({
          course: course,
        });
      });
  };

  nextClick = () => {
    const turns = this.state.turns - 1;
    if (turns === 0) {
      this.setState({ turns: 0 });
    } else {
      const sessionWords = JSON.parse(JSON.stringify(this.state.sessionWords));
      sessionWords[this.state.index].score++;
      let idx = 0;
      if (sessionWords.length > 1) {
        do {
          idx = Math.floor(Math.random() * sessionWords.length);
        } while (idx === this.state.index);
      }
      this.setState({
        turns: turns,
        index: idx,
        sessionWords: sessionWords,
        currentWord: sessionWords[idx],
      });
    }
  };

  goToCourse = () => {
    this.props.history.push("/course/" + this.state.courseId);
  };

  userWrote = (word) => {
    let sessionWords = JSON.parse(JSON.stringify(this.state.sessionWords));
    const wordsLearned = [...this.state.wordsLearned];
    const currentWord = {
      word: this.state.currentWord.word,
      description: this.state.currentWord.description,
      score: this.state.currentWord.score,
    };

    if (currentWord.word === word.trim()) {
      currentWord.score++;
      if (currentWord.score === GOAL_SCORE) {
        wordsLearned.push(currentWord.word);
        sessionWords.splice(this.state.index, 1);
      }
      this.postProgress(sessionWords, wordsLearned);
      this.setState({
        result: "correct",
        sessionWords: sessionWords,
        wordsLearned: wordsLearned,
        currentWord: currentWord,
      });
    } else {
      sessionWords[this.state.index].score = 0;
      currentWord.score = 0;
      this.setState({
        result: "wrong",
        sessionWords: sessionWords,
        currentWord: currentWord,
      });
    }
    setTimeout(this.setResultToLearning, 1000);
  };

  postProgress = (words, wordsLearned) => {
    let progress = { wordsLearned: 0, wordsInProgress: {} };
    console.log("in word score", words);
    for (let pair of words) {
      progress.wordsInProgress[pair.word] = pair.score;
    }
    for (let word of wordsLearned) {
      progress.wordsInProgress[word] = GOAL_SCORE;
      progress.wordsLearned++;
    }
    const profileProgress = JSON.parse(
      JSON.stringify(this.props.profile.progress)
    );
    profileProgress[this.state.courseId] = progress;

    axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
    axios.defaults.xsrfCookieName = "csrftoken";

    axios.defaults.headers = {
      "Content-Type": "application/json",
      Authorization: "Token " + this.props.token,
    };

    const progress_json = JSON.stringify(profileProgress);

    axios
      .put(BASE_URL + "profiles-api/update-progress/", progress_json)
      .then((res) => this.props.updateProfile());
  };

  setResultToLearning = () => {
    if (this.state.result === "wrong") {
      this.setState({ result: "learning" });
    } else {
      const turns = this.state.turns - 1;
      const sessionWords = this.state.sessionWords;
      if (turns === 0) {
        this.setState({ turns: 0 });
      } else if (sessionWords.length === 0) {
        this.setState({ courseFinished: true });
      } else {
        let idx = 0;
        if (sessionWords.length > 1) {
          do {
            idx = Math.floor(Math.random() * sessionWords.length);
          } while (idx === this.state.index);
        }
        const currentWord = sessionWords[idx];
        this.setState({
          result: "learning",
          index: idx,
          turns: turns,
          currentWord: currentWord,
        });
      }
    }
  };

  render() {
    if (this.state.course && !this.state.loading) {
      const pair = this.state.currentWord;
      let content = <NewWordFragment next={this.nextClick} {...pair} />;
      if (this.state.turns === 0 || this.state.courseFinished) {
        content = (
          <SessionComplete
            courseFinished={this.state.courseFinished}
            home={this.goToCourse}
          />
        );
      } else if (pair.score > 0 || this.state.result === "wrong") {
        content = (
          <WriteWordFragment
            result={this.state.result}
            userWrote={this.userWrote}
            pair={pair}
          />
        );
      }
      return (
        <React.Fragment>
          <Header url={this.props.match.url} />
          <HeaderLearnComponent
            turns={this.state.turns}
            totalTurns={TOTAL_TURNS}
            close={this.props.history.goBack}
            name={this.state.course.name}
          />
          {content}
        </React.Fragment>
      );
    } else {
      return (
        <React.Fragment>
          <div className={styles.SpinnerWrapper}>
            <Spinner />
          </div>
        </React.Fragment>
      );
    }
  }
}

const mapStateToProps = (state) => {
  return {
    profile: state.profile,
    token: state.auth.token,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateProfile: () => dispatch(profileActions.profileLoad()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Learn);
