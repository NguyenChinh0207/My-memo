import React from 'react';
import {Divider, Skeleton} from "antd";

const TopEventLoader = () => {
    return (
        <div>
            <div className="d-flex">
                <div style={{width: 40, height: 40, marginRight: 10}}>
                    <Skeleton.Avatar shape={"square"} active size={"large"}/>
                </div>
                <div style={{width: '70%'}}>
                    <Skeleton.Input active style={{width: '100%', height: 10, marginBottom: 20}}/>
                    <Skeleton.Input active style={{width: '50%', height: 10, marginBottom: 20}}/>
                </div>
            </div>
            <Divider/>
            <div className="d-flex">
                <div style={{width: 40, height: 40, marginRight: 10}}>
                    <Skeleton.Avatar shape={"square"} active size={"large"}/>
                </div>
                <div style={{width: '70%'}}>
                    <Skeleton.Input active style={{width: '100%', height: 10, marginBottom: 20}}/>
                    <Skeleton.Input active style={{width: '50%', height: 10, marginBottom: 20}}/>
                </div>
            </div>
        </div>
    );
};

export default TopEventLoader;