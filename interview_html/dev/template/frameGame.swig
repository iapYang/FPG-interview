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
                <li class="game-choice unmade-choice">
                    <span class="number">{{number[i]}}:&nbsp;&nbsp;</span>
                    {% if item.option %}
                        <span>{{item.option}}</span>
                    {% endif %}
                    {% if item.image %}
                        <img class="option-img" src="{{item.image}}" alt=""/>
                    {% endif %}
                    <img class="red-cross" src="./image/cross_1187636_easyicon.net.svg" alt="" />
                </li>
            {% endfor %}
        </ul>
    </div>
    <div class="frame-game-right frame-game-part">
        <div class="frame-game-question">
            {% for i, item in questions %}
                {%if i == 0 %}
                    <span class="question-item show">{{item}}</span>
                    {%else%}
                    <span class="question-item">{{item}}</span>
                {% endif %}
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
