const arraySizeBtn = document.getElementById('array_size_btn'),
    array_place = document.getElementById('array_place'),
    randomFillBtn = document.getElementById('random_fill_btn'),
    table = document.querySelector('.table'),
    message = document.getElementById('message'),
    showPrevMessage = document.getElementById('show-prev-message'),
    resultArrayPlace = document.getElementById('result-array_place'),
    prevArraysPlaceAfter = document.getElementById('prev_arrays_place-after'),
    solveBtn = document.getElementById('solve-btn'),
    showPrev = document.getElementById('show-prev');



const rowsCalcsArr = [
    [0, 2, 3, 9, 7],
    [6, 2, 4, 5, 8],
    [8, 9, 1, 2, 8],
    [6, 5, 4, 3, 0],
    [9, 7, 6, 2, 1]
];

const solves = [];
let calcs = [];

/* Create Result Table Function */
const createResultTable = (array, colorsArray = null, calcArr = null) => {
    let table = document.createElement('table');
    let cellId = 1;
    for (let i = 0; i < array.length; i++) {
        let row = document.createElement('tr');
        for (let j = 0; j < array.length; j++) {
            let cell = document.createElement('td');
            cell.id = `${i}${j}`;
            cellId++;
            if (colorsArray !== null) {
                cell.style.backgroundColor = colorsArray[i][j];
            }
            if (calcArr !== null) {
                if(calcArr[i][j] == "") { 
                    cell.setAttribute('data-tooltip', "Ничего не поменялось");
                } else
                cell.setAttribute('data-tooltip', `${calcArr[i][j][1]}, увеличилось на ${ ((array[i][j] - calcArr[i][j][0]) / calcArr[i][j][0] * 100) || '0'}%` );
            }
            cell.textContent = array[i][j];
            row.appendChild(cell);
        }
        table.appendChild(row);
    }
    return table;
};

/* Create Table Function */
const createTable = value => {
    let table = document.createElement('table');
    table.classList.add('array-block__table');
    let cellId = 1;
    for (let i = 0; i < value; i++) {
        let row = document.createElement('tr');
        for (let j = 0; j < value; j++) {
            let cell = document.createElement('td');
            cell.id = `${i}${j}`;
            cellId++;
            cell.textContent = 0;
            row.appendChild(cell);
        }
        table.appendChild(row);
    }
    return table;
};


/* Array Turn Function */
const matrixTurn = array => {
    let rows = [];
    array.forEach((el, id) => {
        rows.push(array.map(function (value) {
            return value[id];
        }));
    });
    return rows;
};

/* Generate empty matrix with "" */
const generateEmptyMatrix = value => {
    return new Array(value).fill("").map(el => new Array(value).fill(""));
};


const solve = () => {
    /* получаем массив из таблицы */
    let tableInfo = Array.prototype.map.call(document.querySelectorAll('.array-block__table tr'), function (tr) {
        return Array.prototype.map.call(tr.querySelectorAll('td'), function (td) {
            return Number.parseInt(td.innerHTML);
        });
    });

    /* получаем массив столбцов */
    let rows = matrixTurn(tableInfo);



    let rowsColorsArr = generateEmptyMatrix(tableInfo.length);
    let colsColorsArr = generateEmptyMatrix(tableInfo.length);
    let finalColorsArr = generateEmptyMatrix(tableInfo.length);


    let rowsResultArr = generateEmptyMatrix(tableInfo.length);
    let colsResultArr = generateEmptyMatrix(tableInfo.length);
    let finalArr = generateEmptyMatrix(tableInfo.length);

    
    let rowsCalcsArr = generateEmptyMatrix(tableInfo.length);
    let colsCalcsArr = generateEmptyMatrix(tableInfo.length);
    let finalCalcsArr = generateEmptyMatrix(tableInfo.length);

    const getAllIndexes = (arr, val) => { //все индексы элемента
        var indexes = [],
            i = -1;
        while ((i = arr.indexOf(val, i + 1)) != -1) {
            indexes.push(i);
        }
        return indexes;
    }

    tableInfo.forEach((element, identificator) => {
        const arr = tableInfo[identificator];
        const count = arr.reduce((acc, n) => (acc[n] = (acc[n] || 0) + 1, acc), {}); //подсчет количества каждого элемента
        let tempArr = Object.entries(count).filter(el => el[1] > 1); //фильтр для дубликатов, отсекаем элементы, встречающиеся 1 раз
        let duplicatesObj = Object.fromEntries(tempArr.map(n => [n[0], n[1]])); //объект дубликат: кол-во повторений


        Object.keys(duplicatesObj).forEach(el => { //теперь это объект дубликат: [индексы]
            duplicatesObj[el] = getAllIndexes(tableInfo[identificator], Number.parseInt(el));
        })

        Object.keys(duplicatesObj).forEach(item => {
            duplicatesObj[item].map(el => {
                let rowsRepeat = rows[el].filter(e => e == item).length;
                rowsCalcsArr[identificator][el] = (rowsRepeat == 1) ? [item, `(${item} * ${duplicatesObj[item].length})`] : [item, `(${item} * ${rowsRepeat}) + (${item} * ${duplicatesObj[item].length})`];
                                                 
                rowsResultArr[identificator][el] = (rowsRepeat == 1) ? (item * duplicatesObj[item].length) : (rowsRepeat * item) + (item * duplicatesObj[item].length);
                rowsColorsArr[identificator][el] = (rowsRepeat == 1) ? "yellow" : "#40cfff";
                return rows[el].filter(e => e == item).length;
            });
        })

    });

    rows.forEach((element, identificator) => {
        const arr = rows[identificator];
        const count = arr.reduce((acc, n) => (acc[n] = (acc[n] || 0) + 1, acc), {}); //подсчет количества каждого элемента
        let tempArr = Object.entries(count).filter(el => el[1] > 1); //фильтр для дубликатов, отсекаем элементы, встречающиеся 1 раз

        let duplicatesObj = Object.fromEntries(tempArr.map(n => [n[0], n[1]])); //объект дубликат: кол-во повторений
        Object.keys(duplicatesObj).forEach(el => { //теперь это объект дубликат: [индексы]
            duplicatesObj[el] = getAllIndexes(rows[identificator], Number.parseInt(el));
        })

        Object.keys(duplicatesObj).forEach(item => {
            duplicatesObj[item].map(el => {
                let rowsRepeat = tableInfo[el].filter(e => e == item).length;
                colsCalcsArr[identificator][el] = (rowsRepeat == 1) ? [item, `(${item} * ${duplicatesObj[item].length})`] : [item, `(${item} * ${rowsRepeat}) + (${item} * ${duplicatesObj[item].length})`];
                colsResultArr[identificator][el] = (rowsRepeat == 1) ? (item * duplicatesObj[item].length) : (rowsRepeat * item) + (item * duplicatesObj[item].length);
                colsColorsArr[identificator][el] = (rowsRepeat == 1) ? "green" : "#40cfff";
                return tableInfo[el].filter(e => e == item).length;
            });
        })

    });
    colsResultArrTurned = matrixTurn(colsResultArr);
    colsColorsArrTurned = matrixTurn(colsColorsArr);
    colsCalcsArrTurned =  matrixTurn(colsCalcsArr);
    for (let i = 0; i < tableInfo.length; i++) {
        for (let j = 0; j < tableInfo.length; j++) {
            if (rowsResultArr[i][j] == "" && colsResultArrTurned[i][j] !== "") {
                finalArr[i][j] = colsResultArrTurned[i][j];
                finalColorsArr[i][j] = colsColorsArrTurned[i][j];
                finalCalcsArr[i][j] = colsCalcsArrTurned[i][j];
            } else if (rowsResultArr[i][j] !== "" && colsResultArrTurned[i][j] == "") {
                finalArr[i][j] = rowsResultArr[i][j];
                finalColorsArr[i][j] = rowsColorsArr[i][j];
                finalCalcsArr[i][j] = rowsCalcsArr[i][j];
            } else if (rowsResultArr[i][j] !== "" && colsResultArrTurned[i][j] !== "") {
                finalArr[i][j] = colsResultArrTurned[i][j];
                finalColorsArr[i][j] = colsColorsArrTurned[i][j];
                finalCalcsArr[i][j] = colsCalcsArrTurned[i][j];
            }
        }
    }
    for (let i = 0; i < tableInfo.length; i++) {
        for (let j = 0; j < tableInfo.length; j++) {
            if (finalArr[i][j] == "" && tableInfo[i][j] !== "") {
                finalArr[i][j] = tableInfo[i][j];
            }
        }
    }
    calcs = finalCalcsArr;
    let resTable = createResultTable(finalArr, finalColorsArr, finalCalcsArr);
    console.log(solves);
    resultArrayPlace.innerHTML = "";
    resultArrayPlace.appendChild(resTable);
    resultArrayPlace.classList.remove('display-none');


    /* записываем максимум три решения в массив */
    if (solves.length === 3) {
        solves.shift();
    }
    solves.push({
        tableInfo,
        finalArr,
        finalColorsArr
    });
}



/* Change table cells value */
const inputChangeValue = () => {
    const target = event.target;
    if (target.classList.length > 0 || target.tagName !== 'TD' || target.innerHTML === '<input>') {
        return;
    }
    message.textContent = "";
    message.classList.add('array-block__alert_unvisible');
    let input = document.createElement('input');
    input.size = 7;
    input.value = target.innerHTML;
    input.classList.add('array-block__input');
    target.innerHTML = '';
    target.appendChild(input);
    input.focus();
    input.select();
    input.addEventListener('blur', () => {
        if (!Number.isInteger(Number.parseInt(input.value)) || input.value == '' || input.value < 0) {
            message.textContent = "Введите положительное число или 0!";
            message.classList.remove('array-block__alert_unvisible');
            input.focus();
            input.select();
        } else target.innerHTML = Number.parseInt(input.value);
    });
}

/* Create Array Button Click Functon*/
const createTableByInput = () => {
    message.textContent = "";
    array_place.innerHTML = "";
    message.classList.add('array-block__alert_unvisible');
    resultArrayPlace.innerHTML = "";
    resultArrayPlace.classList.add('display-none');
    let input = document.getElementById('array_size');
    let value = parseInt(input.value);
    if (!Number.isInteger(value) || value == '' || value < 2) {
        message.textContent = "Введите положительное число от 2!";
        message.classList.remove('array-block__alert_unvisible');
        return;
    } else if (value > 15) {
        message.textContent = "Зачем так много. Давайте не больше 15 :)";
        message.classList.remove('array-block__alert_unvisible');
        return;
    }
    let table = createTable(value);
    array_place.appendChild(table);
    input.value = "";

    table.addEventListener('click', inputChangeValue);
};


/* Random Fill Function*/
const RandomFill = () => {
    let tds = document.querySelectorAll('.array-block__table td'),
        max = Number.parseInt(document.getElementById('upper-value').innerHTML),
        min = Number.parseInt(document.getElementById('lower-value').innerHTML);
    Array.from(tds).forEach(el => {
        //el.textContent = Math.floor(Math.random() * 10);
        el.textContent = Math.floor(Math.random() * (max - min + 1) + min);
    })
};

const showPreviousSolves = () => {
    if (solves.length === 0) {
        showPrevMessage.textContent = "Пока что нет решений!";
        showPrevMessage.classList.remove('array-block__alert_unvisible');
        setTimeout(() => {
            showPrevMessage.textContent = "";
            showPrevMessage.classList.add('array-block__alert_unvisible');
        }, 5000);
        return;
    }
    showPrevMessage.textContent = "";
    prevArraysPlaceAfter.innerHTML = ""
    showPrevMessage.classList.add('array-block__alert_unvisible');
    solves.forEach(el => {

        let hr = document.createElement('hr');
        hr.style.size = '1000';
        hr.style.color = 'black';
        hr.style.width = '150px';
        let table = createResultTable(el.tableInfo);
        prevArraysPlaceAfter.appendChild(table);
        table = createResultTable(el.finalArr, el.finalColorsArr)
        prevArraysPlaceAfter.appendChild(table);
        prevArraysPlaceAfter.appendChild(hr);
        
    });


};


arraySizeBtn.addEventListener('click', createTableByInput);
randomFillBtn.addEventListener('click', RandomFill);
solveBtn.addEventListener('click', solve);
showPrev.addEventListener('click', showPreviousSolves);





/* Range slider */
let rangeSlider = document.getElementById('slider');
noUiSlider.create(rangeSlider, {
    connect: true,
    behaviour: 'tap',
    start: [0, 9],
    range: {
        'min': 0,
        'max': 9
    },
    step: 1,
});

let nodes = [
    document.getElementById('lower-value'),
    document.getElementById('upper-value')
];

rangeSlider.noUiSlider.on('update', function (values, handle, unencoded, isTap, positions) {
    nodes[handle].innerHTML = Number.parseInt(values[handle]);
});


/* On page load create empty array */
document.addEventListener("DOMContentLoaded", () => {
    let table = createTable(3);
    array_place.appendChild(table);
    table.addEventListener('click', inputChangeValue);
});


var span = document.querySelectorAll('.NameHighlights');
for (var i = span.length; i--;) {
    (function () {
        var t;
        span[i].onmouseover = function () {
            hideAll();
            clearTimeout(t);
            this.className = 'NameHighlightsHover';
        };
        span[i].onmouseout = function () {
            var self = this;
            t = setTimeout(function () {
                self.className = 'NameHighlights';
            }, 300);
        };
    })();
}

function hideAll() {
    for (var i = span.length; i--;) {
        span[i].className = 'NameHighlights'; 
    }
};