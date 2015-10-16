

// 构建字典树
var sensitiveWordMap = {};

// DFA算法, 构建敏感词库
function sensitiveFilterInit(sensitiveArray) {
    var length = sensitiveArray.length;     // 字库长度
    var nowMap = null;
    for (var i = 0; i < length; ++i) {
        var rowWords = sensitiveArray[i];
        var wordArray = rowWords.split("");
        nowMap = sensitiveWordMap;

        var wordLength = wordArray.length;
        for (var index = 0; index < wordLength; ++index) {
            var word = wordArray[index];
            var wordMap = nowMap[word];
            if (wordMap) {
                nowMap = wordMap;
            } else {
                var newWordMap = {};
                newWordMap["isEnd"] = 0;
                nowMap[word] = newWordMap;
                nowMap = newWordMap;
            }

            if (index === wordArray.length - 1) {
                nowMap["isEnd"] = 1;
            }
        }
    }
}

function haveDirtyWord(content) {
    content = content.replace(/[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?]/g, "");
    content = content.replace(/[\ |\·|\！|\￥|\%|\……|\（|\）|\—|\——|\、|\；|\‘|\’|\“|\”|\｛|\｝|\【|\】|\{|\}|\：|\，|\。|\《|\》|\？]/g, "");
    var nowMap = sensitiveWordMap;
    var matchFlag = 0;
    var flag = false;
    var sensitiveWord = [];
    var oneWord = "";

    for (var index = 0; index < content.length; ++index) {
        var word = content.charAt(index);
        if (nowMap[word]) {
            oneWord += word;
            nowMap = nowMap[word];
            matchFlag++;
            if (nowMap["isEnd"]) {
                var nextWord = content.charAt(index + 1);
                if (!nextWord || !nowMap[nextWord]) { //贪婪
                    flag = true;
                    if (sensitiveWord.indexOf(oneWord) === -1) {
                        sensitiveWord.push(oneWord);
                    }
                    oneWord = "";
                    continue;
                }
            }
        } else {
            if (nowMap !== sensitiveWordMap) {
                index = index - matchFlag;
                matchFlag = 0;
                nowMap = sensitiveWordMap;
                oneWord = "";
            }
        }
    }
    
    return { flag: flag, dirtyWords: sensitiveWord, content: content };
}

function checkSensitiveWord(content) {
    var contentWord = haveDirtyWord(content);
    if (contentWord.flag) {
        content = contentWord.content;
        var dirtyWords = contentWord.dirtyWords;
        var dirtyWordLen = dirtyWords.length;

        for (var i = 0; i < dirtyWordLen; ++i) {
            var dirtyWord = dirtyWords[i];
            var replaceString = "";
            
            for (var index = 0; index < dirtyWord.length; ++index) {
                replaceString += "*";
            }

            try {
                var regExp = new RegExp(dirtyWord, 'g');
                content = content.replace(regExp, replaceString);
            } catch (error) {
                console.log("error: ", error);
            } 
        }
    }

    return content;
}

var sensitiveArray = [
    "州三箭",
    "宙最高法",
    "昼将近",
    "主席忏",
    "住英国房",
    "助考",
    "助考网",
    "专业办理",
    "专业代",
    "专业代写",
    "专业助"
];
sensitiveFilterInit(sensitiveArray);

var strContent = "专业办理=助考网-宙s最243高s法fafa-fd宙最ff高法$$$宙@最#高￥￥法";
console.log(checkSensitiveWord(strContent));
