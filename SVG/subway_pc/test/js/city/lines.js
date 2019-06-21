import $ from 'jquery';
import createSvg from '../common/createSvg';

let cityLines = $('<div class="subways-city-lines" id="subways-city-lines"></div>');
$('#subways-wrapper-map').append(cityLines);

const gBox = $('#g-box');

// 渲染城市线路
function renderLines(data) {
    cityLines.html('');

    let html = '';
    const lines = data.subways.l;
    lines.forEach(line => {
        const { l_xmlattr } = line;
        const { lbx, lby, lb, lc } = l_xmlattr;
        let name = lb;
        let color = lc.replace(/^0x/, '#');

        if (name.indexOf('地铁') > 0) {
            name = lb.replace(/地铁/, '');
        }

        html += `<a href="javascript:;" style="color: ${color}" data-subway="subway_${name}" data-x=${lbx} data-y=${lby}>${name}</a>`;
    });

    cityLines.html(html);
}

// 点击线路展现对应路径
function showPath(cb) {
    let flag = false;

    $('.subways-city-lines').on('click', 'a', function() {
        let curAttr = $(this).attr('data-subway');
        const x = $(this).attr('data-x');
        const y = $(this).attr('data-y');

        $(this).addClass('active').siblings().removeClass('active');

        if (!flag) {
            let rect = createSvg('rect').appendTo(gBox);
            rect.attr({
                id: 'rect-mask',
                width: 3000,
                height: 3000,
                x: -1500,
                y: -1500,
                fill: '#fff',
                'fill-opacity': 0.9
            });

            flag = true;
        }

        let children = gBox.find('g');

        for (let i = 0; i < children.length; i++) {
            let child = $(children[i]);
            let attr = child.attr('data-subway');
            
            if (curAttr === attr) {
                child.appendTo(gBox);
            }
        }

        cb && cb({
            x,
            y
        });
        return false;
    });
}


export {
    renderLines,
    showPath
};