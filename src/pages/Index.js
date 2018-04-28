import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from 'material-ui/styles';
import withRoot from '../withRoot';
import Button from 'material-ui/Button';

const {EventEmitter} = require('events');

const styles = theme => ({
    box: {
        width: '100%',
        height: '100%',
    },
    text: {
        borderRadius: 4,
        display: 'inline-block',
        backgroundColor: '#fff',
        borderColor: '#ccc',
        padding: 6,
    },
    theyStyle: {
        marginTop:1,
        marginBottom:1,
        backgroundColor:'#ccc',
        boxSizing: 'border-box',
        padding: 10,
        width: '100%',
    },
    mineStyle: {
        marginTop:1,
        marginBottom:1,
        backgroundColor:'#9cf',
        boxSizing: 'border-box',
        padding: 10,
        textAlign: 'right',
        width: '100%',
        float: 'right'
    }
});
const formatTime = (date, fmt) => {//MM-dd hh:mm
    let o = {
        "M+": date.getMonth() + 1,                 //月份
        "d+": date.getDate(),                    //日
        "h+": date.getHours(),                   //小时
        "m+": date.getMinutes(),                 //分
        "s+": date.getSeconds(),                 //秒
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
        "S": date.getMilliseconds()             //毫秒
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (let k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}

class Index extends React.Component {
    state = {
        list: [{"id":70241743440,"text":"I do believe that chance to have friends wherever can be","dateTime":1524203362000,"isMe":false},{"id":70241751758,"text":"Maybe u didn’t know me still but I can prove the human inside me","dateTime":1524203390000,"isMe":false},{"id":70241788096,"text":"Talk to you next time","dateTime":1524203506000,"isMe":true},{"id":70241795050,"text":"I talk about business","dateTime":1524203529000,"isMe":true},{"id":70241799679,"text":"Ok","dateTime":1524203544000,"isMe":false},{"id":70241800996,"text":"Take ur time","dateTime":1524203548000,"isMe":false},{"id":70241801379,"text":"Talk about business","dateTime":1524203550000,"isMe":true},{"id":70241804957,"text":"I’m here for a month","dateTime":1524203562000,"isMe":false},{"id":70241804861,"text":"Talk about business","dateTime":1524203562000,"isMe":true},{"id":70241806957,"text":"We can still talk","dateTime":1524203569000,"isMe":false},{"id":70241809922,"text":"Even about business if u want","dateTime":1524203578000,"isMe":false},{"id":70309812275,"text":"How r u","dateTime":1524405123000,"isMe":false},{"id":70325547380,"text":"Morning lol","dateTime":1524448243000,"isMe":true},{"id":70325968741,"text":"Good morning","dateTime":1524449575000,"isMe":false},{"id":70325969884,"text":"How r u","dateTime":1524449579000,"isMe":false},{"id":70326187071,"text":"How’s your day","dateTime":1524450265000,"isMe":false},{"id":70416841381,"text":"Hello dear","dateTime":1524717243000,"isMe":false},{"id":70416841741,"text":"How r u","dateTime":1524717244000,"isMe":false},{"id":70417040302,"text":"😜","dateTime":1524717867000,"isMe":true},{"id":70417050226,"text":"What ☺️","dateTime":1524717898000,"isMe":false}]
    };

    isToday(time) {
        let d = new Date(time);
        let todaysDate = new Date();
        if (d.setHours(0, 0, 0, 0) === todaysDate.setHours(0, 0, 0, 0)) {
            return true;
        } else {
            return false;
        }
    }

    updateTimeLine({type = 'refresh'}) {
        let now = new Date().getTime();
        let first = false;
        if (type === 'refresh') {//不保留原时间:用于刷新列表,保留用于单独新增数据
            this.state.list.forEach(item => {
                delete item.hdt;
            })
        }
        if (type === 'append') {
            let notFormatList = [];
            let lastFormat = null;
            for (let item of this.state.list) {
                if (!item.hdt) {
                    notFormatList.push(item);
                } else {
                    lastFormat = item;
                }
            }
            now = lastFormat.dateTime;
            for (let item of notFormatList) {
                if (Math.abs((now - item.dateTime) / (1000 * 60)) > 5) {
                    item.dt = formatTime(new Date(item.dateTime), 'hh:mm');
                    now = item.dateTime;
                }
                item.hdt = true;
            }
        } else if (type === 'refresh') {
            for (let item of [...this.state.list].reverse()) {
                if (this.isToday(item.dateTime)) {
                    if (Math.abs((now - item.dateTime) / (1000 * 60)) > 5) {
                        item.dt = formatTime(new Date(item.dateTime), 'hh:mm');
                        now = item.dateTime;
                    }
                } else {
                    item.dt = formatTime(new Date(item.dateTime), 'MM-dd hh:mm');
                }
                item.hdt = true;
            }
        } else if (type === 'insert') {
            let notFormatList = [];
            let lastFormat = null;
            for (let item of this.state.list) {
                if (!item.hdt) {
                    notFormatList.push(item);
                } else {
                    if (lastFormat === null) {
                        lastFormat = item;
                    }
                }
            }
            console.log(lastFormat);
            for (let item of notFormatList) {
                if (this.isToday(item.dateTime)) {
                    if (Math.abs((now - item.dateTime) / (1000 * 60)) > 5) {
                        item.dt = formatTime(new Date(item.dateTime), 'hh:mm');
                        now = item.dateTime;
                    }
                } else {
                    item.dt = formatTime(new Date(item.dateTime), 'MM-dd hh:mm');
                }
                item.hdt = true;
            }
        }
        this.setState({});
    }

    componentDidMount() {

        let $this = this;
        $this.updateTimeLine({});
        let appendData = function () {
            $this.state.list.push({
                id: 4,
                dateTime: 1524890275623,
                isMe: true,
                text: 'whs'
            });
            $this.state.list.push({
                id: 5,
                dateTime: 1524890285623,
                isMe: true,
                text: 'whs'
            });
            $this.state.list.push({
                id: 6,
                dateTime: 1524890185623,
                isMe: true,
                text: 'whs'
            });
            $this.setState({}, function () {
                $this.updateTimeLine({type: 'append'});
            });
        };
        let insertData = function () {
            $this.state.list.unshift({
                id: 4,
                dateTime: 1521190275623,
                isMe: true,
                text: 'whs'
            });
            $this.state.list.unshift({
                id: 5,
                dateTime: 1521090275623,
                isMe: false,
                text: 'you name'
            });
            $this.setState({}, function () {
                $this.updateTimeLine({type: 'insert'});
            });
        }
        setTimeout(function () {
            // appendData();
            // insertData();
            // setTimeout(function () {
            //     $this.updateTimeLine({persist:false});
            // },2000)
        }, 1000);
    }

    render() {
        const {classes} = this.props;
        return (
            <div className={classes.box}>
                {
                    this.state.list.map(data => {
                        if (data.isMe) {
                            return <div key={data.id} className={classes.mineStyle}>
                                <div>{data.dt}</div>
                                <div className={classes.text}>{data.text}</div>
                            </div>
                        } else {
                            return <div key={data.id} className={classes.theyStyle}>
                                <div>{data.dt}</div>
                                <div className={classes.text}>{data.text}</div>
                            </div>
                        }
                    })
                }
            </div>

        );
    }
}

Index.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withRoot(withStyles(styles)(Index));
