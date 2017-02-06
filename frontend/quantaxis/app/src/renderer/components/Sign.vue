<template>
    <div id="sign">
        <div id="title">
                <h1>#Sign</h1>
                <h2>Welcome to QUANTAXIS</h2>   
        </div>
        <div id='textbox'>
                <span id="signname">Welcome</span>
                <div class="inputText">
                    <input type="text" placeholder="name">
                </div>
                <div class="inputText">
                    <input type="text" placeholder="password">
                </div>
        </div>
    </div>
    
</template>
<style lang="css">
    #sign{
    position:relative;
    width: 100%;
    height: 100%;
    display: block;
    }
    #title{
    position:relative;
    width:60%;
    height:100%;
    float: left;
    display: inline-block;
    margin: 10% 0%;
}
#textbox{
    position:relative;
    width:30%;
    height:100%;
    float: left;
    display: inline-block;
    margin: 15% 0%;
}
#signname{
    font-family: Arial, Helvetica, sans-serif;
    font-size: 30px;
    color: darkgray;
}
</style>