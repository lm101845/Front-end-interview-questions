/* 首先解决click事件300ms延迟的问题 */
FastClick.attach(document.body);

/* 音乐播放器模块 */
const musicModule = (function () {
    const playBtn = document.querySelector('.play-btn'),
        wrapperBox = document.querySelector('.wrapper'),
        progressBox = document.querySelector('.progress'),
        currentBox = progressBox.querySelector('.current'),
        durationBox = progressBox.querySelector('.duration'),
        alreadyBox = progressBox.querySelector('.already'),
        audioBox = document.querySelector('#audioBox');
    let wrapperList = [],
        timer = null,
        n = 0;

    /* 从服务器获取数据 */
    const queryData = function queryData() {
        return new Promise(resolve => {
            let xhr = new XMLHttpRequest;
            xhr.open('GET', './json/lyric.json');
            xhr.onreadystatechange = () => {
                let { readyState, status, responseText } = xhr;
                if (readyState === 4 && status === 200) {
                    let data = JSON.parse(responseText);
                    resolve(data);
                }
            };
            xhr.send();
        });
    };

    /* 歌词绑定 */
    const binding = function binding(lyric) {
        // 歌词的格式化处理
        let arr = [];
        lyric = lyric.replace(/&#(\d+);/g, (val, $1) => {
            let char = val;
            switch (+$1) {
                case 32:
                    char = " ";
                    break;
                case 40:
                    char = "(";
                    break;
                case 41:
                    char = ")";
                    break;
                case 45:
                    char = "-";
                    break;
            }
            return char;
        });
        lyric.replace(/\[(\d+)&#58;(\d+)&#46;(?:\d+)\]([^&#]+)(?:&#10;)?/g, (_, $1, $2, $3) => {
            arr.push({
                minutes: $1,
                seconds: $2,
                text: $3
            });
        });

        // 绑定歌词信息
        let str = ``;
        arr.forEach(item => {
            let { minutes, seconds, text } = item;
            str += `<p minutes="${minutes}" seconds="${seconds}">
                ${text}
            </p>`;
        });
        wrapperBox.innerHTML = str;
        wrapperList = Array.from(wrapperBox.querySelectorAll('p'));
    };

    /* 其他操作 */
    const handler = function handler() {
        // 处理总时间
        let duration = audioBox.duration;
        if (duration) {
            let { minutes, seconds } = formatTime(duration);
            durationBox.innerHTML = `${minutes}:${seconds}`;
        }

        // 播放按钮的事件绑定
        playBtn.onclick = function () {
            if (audioBox.paused) {
                // 当前是暂停的:让其播放
                audioBox.play();
                this.classList.add('move');
                $sub.emit('playing');
                timer = setInterval(() => {
                    $sub.emit('playing');
                }, 1000);
                return;
            }
            // 当前是播放的:让其暂停
            audioBox.pause();
            this.classList.remove('move');
            clearInterval(timer);
        };
    };

    /* 时间格式化：把传递的秒数，转换为分钟和秒 */
    const formatTime = function formatTime(time) {
        let minutes = Math.floor(time / 60),
            seconds = Math.ceil(time - minutes * 60);
        if (minutes < 10) minutes = '0' + minutes;
        if (seconds < 10) seconds = '0' + seconds;
        return {
            minutes,
            seconds
        };
    };

    /* 关于音乐播放和暂停要处理的事情 */
    $sub.on('playing', () => {
        // 控制歌词的处理
        let { minutes, seconds } = formatTime(audioBox.currentTime);
        let arr = wrapperList.filter(item => {
            let minutesAttr = item.getAttribute('minutes'),
                secondsAttr = item.getAttribute('seconds');
            return minutesAttr === String(minutes) && secondsAttr === String(seconds);
        });
        if (arr.length === 0) return;
        wrapperList.forEach(item => {
            if (arr.includes(item)) {
                item.className = "active";
                return;
            }
            item.className = "";
        });
        // 让歌词移动
        n += arr.length;
        if (n >= 4) {
            let pH = wrapperList[0].offsetHeight; //一个P标签的高度
            wrapperBox.style.transform = `translateY(${-((n - 3) * pH)}px)`;
        }
    });
    $sub.on('playing', () => {
        // 控制进度条的处理
        let currentTime = audioBox.currentTime,
            duration = audioBox.duration;
        if (!currentTime || !duration) return;
        // 进度条
        let ratio = (currentTime / duration).toFixed(2);
        if (ratio > 1) ratio = 1;
        alreadyBox.style.width = `${ratio * 100}%`;
        // 时间处理
        let currentObj = formatTime(currentTime),
            durationObj = formatTime(duration);
        currentBox.innerHTML = `${currentObj.minutes}:${currentObj.seconds}`;
        durationBox.innerHTML = `${durationObj.minutes}:${durationObj.seconds}`;
        // 播放完毕
        if (currentTime >= duration) $sub.emit('playend');
    });
    $sub.on('playend', () => {
        // 播放完毕做的事情
        playBtn.classList.remove('move');
        clearInterval(timer);
        n = 0;
        currentBox.innerHTML = '00:00';
        alreadyBox.style.width = `0`;
        wrapperList.forEach(item => item.className = '');
        wrapperBox.style.transform = `translateY(0)`;
    });

    return {
        async init() {
            let { lyric } = await queryData();
            binding(lyric);
            handler();
        }
    };
})();
musicModule.init();