//Урок 5

function isEven(number) {
      return number % 2 === 0 ? true : false;
}

function clearNode(node) {
	var chBoard =document.querySelector(node);
    var children = chBoard.childNodes;
    while(children.length) {
        chBoard.removeChild(children[0]);
    }
}

function runChessBoard(){
//Проверим радиобуттоны, чтобы определить какого цвета фигуры должны стоять сверху
	var radio=document.getElementsByName('rb1');
        if (radio[0].checked) {
        	return createChessBoard(true);
        }
        else {
        	return createChessBoard(false);
        } 
}

function createChessBoard(whiteIsOnTop) {
	var v = [8,7,6,5,4,3,2,1];
	var h = ['A','B','C','D','E','F','G','H'];
	var whiteFig = ['figure_wPawn','figure_wRook','figure_wKnight','figure_wBishop',
	'figure_wKing','figure_wQueen','figure_wBishop','figure_wKnight','figure_wRook'];
	var blackFig = ['figure_bPawn','figure_bRook','figure_bKnight','figure_bBishop',
	'figure_bKing','figure_bQueen','figure_bBishop','figure_bKnight','figure_bRook'];
	var chessBoard = document.querySelector('.chessBoard');
	//Сначала очистим все содержимое корневого узла
	clearNode('.chessBoard');

//Цикл по строкам
	for (var i = 0; i <= v.length - 1; i++) {

		var celVert = document.createElement('div');
		var celLbl = document.createElement('div');
		
		// Делаем нумерацию строк по вертикали
		celVert.classList.add('cell','cell_lbl');
		celLbl.classList.add('cell__item','cell__item_label');
		celLbl.innerText = v[i];
		chessBoard.appendChild(celVert);
		celVert.appendChild(celLbl);
		
			//Цикл по колонкам
			for (var j = 1; j <= h.length; j++) {
			
				var cell = document.createElement('div');
				var cellItem = document.createElement('div');
				var figure = document.createElement('div');
				cell.classList.add('cell');

					/*Раскрашиваем клетки. Если четная строка и четная колонка, 
					или если нечетная строка и нечетная колонка, то черная.	Иначе - белая
					*/
					if ((isEven(v[i]) && isEven(j)) || (!isEven(v[i]) && !isEven(j))){
						cell.classList.add('cell_black');
					}
						else {
						cell.classList.add('cell_white');	
					}

				cellItem.classList.add('cell__item');
				chessBoard.appendChild(cell);
				cell.appendChild(cellItem);
				cellItem.appendChild(figure);

				//Расставляем фигуры в строках (Фигуры стоят только в 8,7,2,1 строках)
				switch (v[i]) {
					case 8: 
					if (whiteIsOnTop) {
						figure.classList.add('figure',whiteFig[j]);
					} else {
						figure.classList.add('figure',blackFig[j]);
					} 
					break;
					case 7:
					if (whiteIsOnTop) { 
						figure.classList.add('figure',whiteFig[0]);
					} else {
						figure.classList.add('figure',blackFig[0]);
					}
					break;
					case 2:
					if (whiteIsOnTop) { 
						figure.classList.add('figure',blackFig[0]);
					} else {
						figure.classList.add('figure',whiteFig[0]);
					}
					break;
					case 1: 
					if (whiteIsOnTop) {
						figure.classList.add('figure',blackFig[j]);
					} else {
						figure.classList.add('figure',whiteFig[j]);	
					}
					break;
				}
			}
	}
// Подпись колонок буквами снизу
	h.unshift(null);
	for (var n = 0; n <= h.length -1 ; n++) {
		var cellHor = document.createElement('div');
		var cellItemH = document.createElement('div');
		cellHor.classList.add('cell','cell_lbl');
		cellItemH.classList.add('cell__item','cell__item_label');
		cellItemH.innerText = h[n];
		chessBoard.appendChild(cellHor);
		cellHor.appendChild(cellItemH);	
	}
}




