class Pagination {

  constructor(paginationProps){

    const {elementID, RowNumber, maxButtons, dataUrl} = paginationProps;

    this.tableFetched = document.getElementById(`${elementID}`);;
    this.rowsToDisplayPerPage = RowNumber;
    this.paginationNumbers = maxButtons;
    this.url = dataUrl;

    if(this.url){
      this.fetchData(this.url, this.tableFetched);
    } else {
      // Load pagination without data on page
      this.initializePagination(this.rowsToDisplayPerPage, this.paginationNumbers)
    }
    
  }

  fetchData = async (url, tableFetched) => {
    await fetch(url)
    .then(response => response.text())
    .then(data => {tableFetched.innerHTML = data})
    .then(() => {
      this.initializePagination(this.rowsToDisplayPerPage, this.paginationNumbers);
    })
  }   

  initializePagination(rowsToDisplayPerPage, paginationNumbers){

    let paginationBtns = [];
    const nextBtn = document.getElementById('next');
    const previousBtn = document.getElementById('previous');
    const dataRows = document.querySelectorAll('.data-row');
    const rowCount = dataRows.length;
    const allRowIndexesArray = Array.from(Array(rowCount).keys());
    const numberOfPages = Math.ceil(dataRows.length/rowsToDisplayPerPage);
    const allBtnsIndexArray = Array.from(Array(numberOfPages).keys());
    
    const pagesArrays = createPageIndexArrays(allRowIndexesArray, rowsToDisplayPerPage); 
    
    if(nextBtn){
      nextBtn.addEventListener('click', displayNextPage);
    }
    
    if(previousBtn){
      previousBtn.addEventListener('click', displayPreviousPage);
    }

    let btnArrayValue = 0;
    createCurrentPageNumbers(numberOfPages, nextBtn, paginationBtns);
    displayCurrentPageNumbers(btnArrayValue, allBtnsIndexArray);
    displayFirstPage(pagesArrays, dataRows);

    // Make the next btn after the previous button active
    if(previousBtn){
      let currentBtn = previousBtn.nextElementSibling;
      activePageNumber(currentBtn);
    }
    
    // Split the allRowIndexesArray into pages arrays
    function createPageIndexArrays(){
      
      const pagesArrays = allRowIndexesArray.reduce((pagesArrays, currentValue, index, array)  => {
        
        let pageIndex = Math.floor(index/rowsToDisplayPerPage);

        if(!pagesArrays[pageIndex]) {
          pagesArrays[pageIndex] = [];
        }
        
        pagesArrays[pageIndex].push(currentValue);

        return pagesArrays;
      }, []);

      return pagesArrays;
    }

    // Split the total pages into paginationNumbers button arrays
    function createPageBtnIndexArrays(){

      const btnsArrays = allBtnsIndexArray.reduce((resultsBtnsArray, item, index) => { 
        
        const btnIndex = Math.floor(index/paginationNumbers)
      
        if(!resultsBtnsArray[btnIndex]) {
          resultsBtnsArray[btnIndex] = []
        }
      
        resultsBtnsArray[btnIndex].push(item)
      
        return resultsBtnsArray
      }, [])

      return btnsArrays;
    }

    const arrayDifference = (allIndexesArray, indexesToRemoveArray) => {

      return allIndexesArray.filter(i => {
        
        return indexesToRemoveArray.indexOf(i) == -1;
      });
    };

    function createCurrentPageNumbers(numberOfPages, nextBtn, paginationBtns){

      for(let j = 0; j < numberOfPages; j++){

        let pageNumbers = document.createElement('li');
        pageNumbers.classList.add('page-item');
        pageNumbers.classList.add('page-number');
        
        let pageLink = document.createElement('a');
        pageLink.setAttribute("id", j+1);
        pageLink.classList.add('page-link');
        pageLink.innerText = j+1;

        pageNumbers.appendChild(pageLink);
        nextBtn.before(pageNumbers);

        paginationBtns.push(pageNumbers);
      }
      
    }

    function displayCurrentPageNumbers(btnArrayValue){
      
      const pageNumbers = document.querySelectorAll('.page-number');
      const btnsArrays = createPageBtnIndexArrays();
      let startIndex = parseInt(btnsArrays[btnArrayValue].slice(0));
      let endIndex = parseInt(btnsArrays[btnArrayValue].slice(-1))+1;

      resetVisiblePageNumbers(pageNumbers);
      displayPageNumbers(startIndex, endIndex, pageNumbers);
      pageNumbers[startIndex].classList.add('active');

    }

    function displayFirstPage(pagesArrays, dataRows){
      
      let firstPage = pagesArrays[0];

      dataRows.forEach((row, i) => {
        // Add the visible class
        if(firstPage[i] == i) {

          for(let n = firstPage[0]; n < firstPage.length; n++){

            dataRows[n].classList.add('visible');
          }
        }
        // Display all items with visible class
        if(!row.classList.contains('visible')){

          row.style.display = 'none';
        }  
      });
    }

    function displayPrevPageNumbers(btnArrayValue){
      
      const pageNumbers = document.querySelectorAll('.page-number');
      const btnsArrays = createPageBtnIndexArrays();
      let startIndex = parseInt(btnsArrays[btnArrayValue].slice(0));
      let endIndex = parseInt(btnsArrays[btnArrayValue].slice(-1))+1;

      resetVisiblePageNumbers(pageNumbers);
      displayPageNumbers(startIndex, endIndex, pageNumbers);
      pageNumbers[endIndex].classList.add('active');

    }



    function displayPageNumbers(startIndex, endIndex, pageNumbers){

      for(let k = startIndex; k < endIndex; k++){

        pageNumbers[k].classList.add('visible');
      }

      pageNumbers.forEach(pageNumber => {

        if(pageNumber.classList.contains('visible')){
          
          pageNumber.style.setProperty('display','block');

        } else {
          
          pageNumber.style.display = 'none';
        }
      })
    }

    function resetVisiblePageNumbers(pageNumbers){

      pageNumbers.forEach(pageNumber => {

        let currentVisible = pageNumber.className.includes('visible');

        if(currentVisible){

          pageNumber.classList.remove('visible');
          pageNumber.style.setProperty('display', 'none');
        }
      })
    }

    function displayNextPage(e){

      let currentBtn = document.getElementsByClassName('page-item page-number active');
      let currentBtnNumber = parseInt(currentBtn[0].firstChild.innerText)+1;
      let nextBtnNumber = currentBtnNumber-1;
      let btnsArrays = createPageBtnIndexArrays();

      if(currentBtnNumber !== numberOfPages+1){

        let resultNext = nextBtnNumber%paginationNumbers;

        if(resultNext === 0) {
          
          for(let arrayIndex = 0; arrayIndex < btnsArrays.length; arrayIndex++){

            let nextArray = btnsArrays[arrayIndex].includes(nextBtnNumber);

            if(nextArray){

              let btnArrayValue = arrayIndex;
              displayCurrentPageNumbers(btnArrayValue);
            }
          }
        }

        let nextBtn = currentBtn[0].nextElementSibling
        nextBtn.click(e);
      }
    }

    function displayPreviousPage(e){

      let currentBtn = document.getElementsByClassName('page-item page-number active');
      let currentBtnNumber = parseInt(currentBtn[0].firstChild.innerText)-1;
      let prevBtnNumber = currentBtnNumber-2;
      let btnsArrays = createPageBtnIndexArrays();
      
      if(currentBtnNumber !== -1){

        let resultPrev = (currentBtnNumber)%paginationNumbers;

        if(resultPrev === 0) {

          prevBtnNumber = prevBtnNumber + 1

          for(let arrayInd = 0; arrayInd < btnsArrays.length; arrayInd++){

            let prevArray = btnsArrays[arrayInd].includes(prevBtnNumber);

            if(prevArray){
              
              let btnArrayValue = arrayInd;
              displayPrevPageNumbers(btnArrayValue);
            }
          }
        }

        let prevBtn = currentBtn[0].previousElementSibling
        prevBtn.click(e);
      }
    }

    // Add active class to clicked page number
    function activePageNumber(currentBtn){

      paginationBtns.forEach(btn => {

        btn.addEventListener('click', (e) => {
          
          let clickedBtn = btn;    

          if(currentBtn !== clickedBtn){
            
            clickedBtn.className += ' active';
            currentBtn.classList.remove('active');
            currentBtn = clickedBtn;
            displayPage(e);
          }
        });
      })
    }

    function displayPage(e){

      const pagesArrays = createPageIndexArrays();
      let pageNumbers = Number(e.target.innerText);
      let pageArrayToDisplay = pageNumbers - 1;
      let pagesToDisplay = pagesArrays[pageArrayToDisplay];
      const pagesNotToDisplay = arrayDifference(allRowIndexesArray, pagesToDisplay);

      dataRows.forEach((row, index) => {
        // Remove visible class from pagesNotToDisplay
        pagesNotToDisplay.forEach(page => {

          if(page == index){

            dataRows[page].classList.remove('visible');
          }
        })
        // Add visible class to pagesToDisplay
        if(pagesToDisplay[index] !== undefined){
          
          dataRows[pagesToDisplay[index]].classList.add('visible');
        }
        // Display all items with visible class
        if(row.classList.contains('visible')){
          
          row.style.display = 'table-row';
        } else {
          
          row.style.display = 'none';
        }
      });
    }
  }
}