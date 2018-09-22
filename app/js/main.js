document.addEventListener('DOMContentLoaded', dragNdrop);
document.addEventListener('DOMContentLoaded', slider);

function dragNdrop() {

	const progressN = document.querySelector('#progressN'),
		  completedN = document.querySelector('#completedN'),
		  dropHere = document.querySelector('#dropHere'),
		  inProgressCol = document.querySelector('#inProgressCol'),
		  completedCol = document.querySelector('#completedCol'),
		  draggableDivs = document.querySelectorAll('.dnd__div');
		  
	let movingEl;	

	const dragStart = function(e) {
		movingEl = e.currentTarget;
		e.dataTransfer.effectAllowed = 'move';
		
		if (movingEl.parentNode.id === 'inProgressCol') {
			completedCol.appendChild(dropHere);
			dropHere.style.display = 'block';
		}

		if (movingEl.parentNode.id === 'completedCol') {
			inProgressCol.appendChild(dropHere);
			dropHere.style.display = 'block';
		}

		dropHere.addEventListener('dragover', dragOver);
		dropHere.addEventListener('drop', dragDrop);
	};

	const dragEnd = function(e) {
		dropHere.removeEventListener('drop', dragDrop);
    	dropHere.style.display = 'none';
	};

	const dragOver = function(e) {
		e.preventDefault();
    	e.dataTransfer.dropEffect = 'move';
    	return false;
	};

	const dragDrop = function(e) {
		e.target.parentNode.appendChild(movingEl);
	    counters();
	};

	const counters = function() {
		progressN.textContent = `(${inProgressCol.querySelectorAll('.dnd__div').length})`;
		completedN.textContent = `(${completedCol.querySelectorAll('.dnd__div').length})`;
	};

	counters();

	for (i = 0; i < draggableDivs.length; i++) {
		draggableDivs[i].addEventListener('dragstart', dragStart);
		draggableDivs[i].addEventListener('dragend', dragEnd);
	};
}

function slider() {
	const prev = document.querySelector('#prev'),
		  next = document.querySelector('#next'),
		  sliderWrapper = document.querySelector('#slider-wrapper');
		  
	prev.addEventListener('click', () => {
		const currentEl = sliderWrapper.querySelector('.show');

		if (!currentEl.previousElementSibling) {
			sliderWrapper.lastElementChild.classList.add('show');
			sliderWrapper.lastElementChild.classList.remove('none');
			currentEl.classList.remove('show');
			currentEl.classList.add('none');
		} else {
			currentEl.previousElementSibling.classList.remove('none');
			currentEl.previousElementSibling.classList.add('show');
			currentEl.classList.remove('show');
			currentEl.classList.add('none');
		}		
	})	

	next.addEventListener('click', () => {
		const currentEl = sliderWrapper.querySelector('.show');

		if (!currentEl.nextElementSibling) {
			sliderWrapper.firstElementChild.classList.add('show');
			sliderWrapper.firstElementChild.classList.remove('none');
			currentEl.classList.remove('show');
			currentEl.classList.add('none');
		} else {
			currentEl.nextElementSibling.classList.remove('none');
			currentEl.nextElementSibling.classList.add('show');
			currentEl.classList.remove('show');
			currentEl.classList.add('none');
		}		
	})	  
}


