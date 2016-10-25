<div class="circle">
    <div class="game-number">
        <span>#{{index}}</span>
    </div>
</div>
<div class="frame-game-wrapper">
    <div class="frame-game-left frame-game-part">
        <ul class="options">
            {% set number = ['A', 'B', 'C'] %}
            {% for i, item in options %}
                <li>
                    <span>{{number[i]}}:&nbsp;&nbsp;</span>
                    {% if item.option %}
                        <span>{{item.option}}</span>
                    {% endif %}
                    {% if item.image %}
                        <img class="option-img" src="{{item.image}}" alt=""/>
                    {% endif %}
                </li>
            {% endfor %}
        </ul>
    </div>
    <div class="frame-game-right frame-game-part">
        <div class="frame-game-question">
            {% for i, item in questions %}
                <span>{{item}}</span>
            {% endfor %}
        </div>
        <div class="divide-line"></div>
    </div>
    <div class="line line-top">
        <div class="bar"></div>
    </div>
    <div class="line line-right">
        <div class="bar"></div>
    </div>
    <div class="line line-left">
        <div class="bar"></div>
    </div>
    <div class="line line-bottom">
        <div class="bar"></div>
    </div>
</div>
<div class="page-back">
    <img src="./image/previous_256px_1139530_easyicon.net.png" alt=""/>
</div>
