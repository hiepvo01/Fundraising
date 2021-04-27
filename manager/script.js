window.onload = async function() {
    let students = await fetch("https://vohi01.pythonanywhere.com/students")
    .then(response => response.json())

    var select = document.getElementById("selectStudent");
    students = students['students']
    for(let i = 0; i < students.length; i++) {
        let opt = students[i];
        let el = document.createElement("option");
        el.innerText = opt;
        select.appendChild(el);
    }

    
    var select = document.getElementById("selectFund");
    students = ['General Fund', 'Student Fund']
    for(let i = 0; i < students.length; i++) {
        let opt = students[i];
        let el = document.createElement("option");
        el.innerText = opt;
        select.appendChild(el);
    }

    let merchants = await fetch("https://vohi01.pythonanywhere.com/merchants")
    .then(response => response.json())
    
    var select = document.getElementById("selectMerchant");
    merchants = merchants['merchants']
    for(let i = 0; i < merchants.length; i++) {
        let opt = merchants[i];
        let el = document.createElement("option");
        el.innerText = opt;
        select.appendChild(el);
    }
}

async function getStudent(){
    student = document.getElementById('selectStudent').value
    studentName = student.split(" ")[1]
    url = "https://vohi01.pythonanywhere.com/students/" + studentName
    let result = await fetch(url).then(response => response.json())

    let studentTotal = document.getElementById('studentTotal');
    let total = result[result.length-1]['Total Discretion']
    studentTotal.innerHTML = "The total amount donated to student " + studentName + " is: $" + total

    var tbody = document.getElementById('sbody');
    tbody.innerHTML = "";
    for (var i = 0; i < result.length -1; i++) {
        let row1 = document.createElement('tr')
        for (var k of Object.keys(result[i])) {
            let thead = document.createElement('th');
            thead.innerHTML = k;
            row1.appendChild(thead)
        }
        tbody.appendChild(row1)
        let row2 = document.createElement('tr')
        for (var k of Object.keys(result[i])) {
            let tdata = document.createElement('td');
            tdata.innerHTML = result[i][k];
            row2.appendChild(tdata)
        }
        tbody.appendChild(row2)
    }
}

async function getFund(){
    let oldfund = document.getElementById('selectFund').value;
    fund = oldfund.replace(' ', '');
    fund = fund.toLowerCase();
    url = "https://vohi01.pythonanywhere.com/" + fund
    let result = await fetch(url).then(response => response.json())

    let studentTotal = document.getElementById('fundTotal');
    let total = result[result.length-1]['Total Discretion']
    studentTotal.innerHTML = "The total amount donated to " + oldfund + " is: $" + total

    var tbody = document.getElementById('fbody');
    tbody.innerHTML = "";
    for (var i = 0; i < result.length -1; i++) {
        let row1 = document.createElement('tr')
        for (var k of Object.keys(result[i])) {
            let thead = document.createElement('th');
            thead.innerHTML = k;
            row1.appendChild(thead)
        }
        tbody.appendChild(row1)
        let row2 = document.createElement('tr')
        for (var k of Object.keys(result[i])) {
            let tdata = document.createElement('td');
            tdata.innerHTML = result[i][k];
            row2.appendChild(tdata)
        }
        tbody.appendChild(row2)
    }
}

async function getMerchant(){
    let oldfund = document.getElementById('selectMerchant').value;
    if (oldfund.includes("A&W/LIS 10%")){
        oldfund= "A&W_LIS10%"
    }
    fund = oldfund.replace(' ', '%20');
    url = "https://vohi01.pythonanywhere.com/merchants/" + fund
    let result = await fetch(url).then(response => response.json())

    let studentTotal = document.getElementById('merchantTotal');
    console.log(result[result.length-1])
    let total = result[result.length-1]['Total Cards']
    studentTotal.innerHTML = "The total number of cards sold by " + oldfund + " is: " + total

    var tbody = document.getElementById('mbody');
    tbody.innerHTML = "";
    for (var i = 0; i < result.length -1; i++) {
        let row1 = document.createElement('tr')
        for (var k of Object.keys(result[i])) {
            let thead = document.createElement('th');
            thead.innerHTML = k;
            row1.appendChild(thead)
        }
        tbody.appendChild(row1)
        let row2 = document.createElement('tr')
        for (var k of Object.keys(result[i])) {
            let tdata = document.createElement('td');
            tdata.innerHTML = result[i][k];
            row2.appendChild(tdata)
        }
        tbody.appendChild(row2)
    }
}

async function date(){
    bdate = document.getElementById('beginDate').value;
    edate = document.getElementById('endDate').value
    console.log(bdate)
    if(bdate =="" || edate =="") {
        alert("Please select both begin date and end date")
    } else {
        url = "https://vohi01.pythonanywhere.com/date/" + bdate + '/' + edate
        let result = await fetch(url).then(response => response.json())

        let studentTotal = document.getElementById('dateTotal');
        console.log(result[result.length-1])
        let total = result[result.length-1]['Total Cards']
        studentTotal.innerHTML = "The number of cards sold between " + bdate + ' and ' + edate + " is: " + total

        var tbody = document.getElementById('dbody');
        tbody.innerHTML = "";
        for (var i = 0; i < result.length -1; i++) {
            let row1 = document.createElement('tr')
            for (var k of Object.keys(result[i])) {
                let thead = document.createElement('th');
                thead.innerHTML = k;
                row1.appendChild(thead)
            }
            tbody.appendChild(row1)
            let row2 = document.createElement('tr')
            for (var k of Object.keys(result[i])) {
                let tdata = document.createElement('td');
                tdata.innerHTML = result[i][k];
                row2.appendChild(tdata)
            }
            tbody.appendChild(row2)
        }
    }
}