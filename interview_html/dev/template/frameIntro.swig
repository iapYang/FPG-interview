<div class="frame-intro-item">
    <div class="frame-intro-item-wrapper">
        <div class="frame-intro-item-left">
            <div class="left-mask mask"></div>
            <img src={{image}} alt=""/>
            <div class="right-mask mask"></div>
        </div>
        <div class="frame-intro-item-right">
            <div class="info-contianer">
                <div class="category">
                    <span>{{category}}</span>
                </div>
                <div class="title">
                    <span>{{title}}</span>
                </div>
                <div class="sub-title">
                    <span>{{sub_title}}</span>
                </div>
                <div class="degree">
                    {% for item in [1,2,3,4,5] -%}
                        {% if item <= star %}
                            <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 53.867 53.867" style="enable-background:new 0 0 53.867 53.867;" xml:space="preserve">
                                <polygon style="fill:#EFCE4A;" stroke="#EFCE4A" stroke-width=1 points="26.934,1.318 35.256,18.182 53.867,20.887 40.4,34.013 43.579,52.549 26.934,43.798
                                10.288,52.549 13.467,34.013 0,20.887 18.611,18.182 "/>
                            </svg>
                        {% else %}
                        <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 53.867 53.867" style="enable-background:new 0 0 53.867 53.867;" xml:space="preserve">
                            <polygon style="fill:transparent;" stroke="#EFCE4A" stroke-width=1 points="26.934,1.318 35.256,18.182 53.867,20.887 40.4,34.013 43.579,52.549 26.934,43.798
                            10.288,52.549 13.467,34.013 0,20.887 18.611,18.182 "/>
                        </svg>
                        {% endif %}
                    {%- endfor %}
                </div>
                <div class="finish-word">
                    <span class="correct">correct</span>
                    <span class="incorrect">incorrect</span>
                </div>
            </div>
        </div>
        <div class="next-page">
            <img src="./image/next_128px_1139524_easyicon.net.png" alt=""/>
        </div>
    </div>
</div>
