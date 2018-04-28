import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from 'material-ui/styles';
import withRoot from '../withRoot';
import Button from 'material-ui/Button';
const {EventEmitter}= require('events');

const styles = theme => ({
    box: {
        width:'100%',
        height:'100%',
        backgroundColor:'#CCC'
    },
    text:{
        borderRadius:4,
        display:'inline-block',
        backgroundColor:'#fff',
        borderColor:'#ccc',
        padding:6,
    },
    theyStyle:{
        boxSizing:'border-box',
        padding:10,
        width:'100%',
    },
    mineStyle:{
        boxSizing:'border-box',
        padding:10,
        textAlign:'right',
        width:'100%',
        float:'right'
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
        list:[
            {
                id:1,
                dateTime:1521887755875,
                text:'hello',
            },
            {
                id:2,
                dateTime:1524887715875,
                isMe:true,
                text:'how are you.'
            },
            {
                id:3,
                dateTime:1524889672687,
                isMe:true,
                text:'hey gues'
            }
        ]
    };

    isToday(time){
        let d = new Date(time);
        let todaysDate = new Date();
        if(d.setHours(0,0,0,0) === todaysDate.setHours(0,0,0,0)){
            return true;
        } else {
            return false;
        }
    }

    updateTimeLine({persist}){
        let now = new Date().getTime();
        let first = false;
        if(!persist){//不保留原时间:用于刷新列表,保留用于单独新增数据
            this.state.list.forEach(item=>{
                delete item.hdt;
            })
        }
        if(persist){
            let notFormatList = [];
            let lastFormat = null;
            for(let item of this.state.list){
                if(!item.hdt){
                    notFormatList.push(item);
                }else{
                    lastFormat = item;
                }
            }
            now = lastFormat.dateTime;
            for(let item of notFormatList){
                if(Math.abs((now-item.dateTime)/(1000*60))>5){
                    item.dt = formatTime(new Date(item.dateTime),'hh:mm');
                    now = item.dateTime;
                }
                item.hdt = true;
            }
        }else{
            for(let item of [...this.state.list].reverse()){
                if(!item.hdt){
                    if(this.isToday(item.dateTime)){
                        if(((now-item.dateTime)/(1000*60))>5){
                            item.dt = formatTime(new Date(item.dateTime),'hh:mm');
                            now = item.dateTime;
                        }
                    }else{
                        item.dt = formatTime(new Date(item.dateTime),'MM-dd');
                    }
                    item.hdt = true;
                }
            }
        }
        this.setState({});
    }

    componentDidMount(){

        let $this = this;
        $this.updateTimeLine({});
        setTimeout(function () {
            $this.state.list.push({
                id:4,
                dateTime:1524890275623,
                isMe:true,
                text:'whs'
            });
            $this.state.list.push({
                id:5,
                dateTime:1524890285623,
                isMe:true,
                text:'whs'
            });
            $this.state.list.push({
                id:6,
                dateTime:1524890185623,
                isMe:true,
                text:'whs'
            });
            $this.setState({},function () {
                $this.updateTimeLine({persist:true});
            });
            // setTimeout(function () {
            //     $this.updateTimeLine({persist:false});
            // },2000)
        },1000);
    }
    render() {
        const {classes} = this.props;
        return (
            <div className={classes.box}>
                {
                    this.state.list.map(data=>{
                        if(data.isMe){
                            return <div key={data.id} className={classes.mineStyle}>
                                <div>{data.dt}</div>
                                <div className={classes.text}>{data.text}</div>
                            </div>
                        }else{
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
