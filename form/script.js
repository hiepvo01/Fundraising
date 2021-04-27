var cards_dict = {};

$(document).ready(function() {
    $(".quantity").change(function() {
        var $row = $(this).closest("tr");
        var special = "";
        $row.children().each(function(idx, val){
            if(val.innerHTML.includes('special1')) {
                special = "special1"
            } else if(val.innerHTML.includes('special2')) {
                special = "special2"
            } else if(val.innerHTML.includes('special3')) {
                special = "special3"
            };
        })    
        
        if (special == ""){
            var $text = $row.find(".denomination").text();
            var $amount = $row.find(".amount")
            
            var label = $(this).closest('tr').prevAll('tr:has(td.merchant):first')
                     .children('td.merchant');

            if (!(label.text() in cards_dict)){
                cards_dict[label.text()] = [{
                    'denomination': $text,
                    'quantity': $(this).val(),
                    'amount': math.evaluate($text + '*' + $(this).val()),
                    'discretion': math.evaluate($text + '*' + $(this).val() + '*0.01'),
                }];
            } else {
                let exist = false;
                for (c of cards_dict[label.text()]) {
                    if(c['denomination'] == $text){
                        c['quantity'] = $(this).val();
                        c['amount'] = math.evaluate($text + '*' + $(this).val());
                        c['discretion'] = math.evaluate($text + '*' + $(this).val() + '*0.01')
                        exist = true;
                    }
                }
                if(!exist) {
                    cards_dict[label.text()].push({
                        'denomination': $text,
                        'quantity': $(this).val(),
                        'amount': math.evaluate($text + '*' + $(this).val()),
                        'discretion': math.evaluate($text + '*' + $(this).val() + '*0.01')
                    })
                }
            }

            $amount.text(math.evaluate($text + '*' + $(this).val()))
        } else {
            var $text = document.getElementById(special).value
            var $amount = $row.find(".amount")
            
            $amount.text(math.evaluate($text + '*' + $(this).val()))
        }
        var due = 0
        $('.amount').each(function(idx, val){
            var totalDue = document.getElementById("totalDue")
            if (parseFloat(val.innerHTML) > 0){
                due += parseFloat(val.innerHTML)
                totalDue.innerText= due;
            }
        })
        
        inputs = document.getElementsByClassName('quantity');
        let cards = 0
        for (index = 0; index < inputs.length; ++index) {
            var totalCards = document.getElementById("totalCards")
            if (parseFloat(inputs[index].value) > 0){
                cards += parseFloat(inputs[index].value);
                totalCards.innerText= cards;
            }
        }

        var totalDiscretion = document.getElementById("totalDiscretion");
        totalDiscretion.innerText= due * 1 / 100;
    });
  })

  function ckChange(ckType){
    var ckName = document.getElementsByName(ckType.name);
    var checked = document.getElementById(ckType.id);

    if (checked.checked) {
      for(var i=0; i < ckName.length; i++){

          if(!ckName[i].checked){
              ckName[i].disabled = true;
          }else{
              ckName[i].disabled = false;
          }
      } 
    }
    else {
      for(var i=0; i < ckName.length; i++){
        ckName[i].disabled = false;
      } 
    }    
}

function printPage(){
    window.print(cards_dict);
}

function submitForm(){
    var request = new XMLHttpRequest();
    request.open('POST', 'https://vohi01.pythonanywhere.com/post_orders');
    request.setRequestHeader("Access-Control-Allow-Origin", "*");
    request.setRequestHeader("Content-Type", "application/json");
    
    let target = "";
    let purchaser = document.getElementById("purchaser");
    let date = document.getElementById("date");
    if(purchaser.value == "" || date.value == ""){
        alert("Purchaser or Date not Entered")
    }
    if(document.getElementById('student').checked) {
        studentName = document.getElementById('studentName').value
        target = "Student " + studentName
    } else if (document.getElementById('students').checked) {
        target = "Student Fund"
    } else if (document.getElementById('generalFund').checked) {
        target = "General Fund"
    } else {
        alert("Purchaser Discretion not selected")
    }
    if(target != "" && purchaser.value != "" && date.value != ""){
        cards_dict['Target'] = target;
        cards_dict['Purchaser'] = purchaser.value;
        cards_dict['Date'] = date.value;
        let newdict = JSON.stringify(cards_dict);
        request.send(newdict);
        alert("Cards Data submitted")
    }
}
