const BASE_URL = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/";

const dropdowns=document.querySelectorAll(".dropdown select");
const btn=document.querySelector("form button");

const fromCurr=document.querySelector(".from select");
const toCurr=document.querySelector(".to select");

const msg=document.querySelector(".msg");

const exchangeIcon=document.querySelector("form i");

for(let select of dropdowns)
{
    for(let currCode in countryList)
        {
            // 
            let newOption=document.createElement("option");
            newOption.innerText=currCode;
            newOption.value=currCode;
            if(select.name==="from" && currCode==="USD")
            {
                newOption.selected="selected";
            }
            else if(select.name==="to" && currCode==="INR"){
                newOption.selected="selected";
            }
            select.append(newOption);
        }
        select.addEventListener("change",(evt)=>{
            updateFlag(evt.target);
        });
}



const updateFlag=(element)=>{
    //console.log(element);
    let currCode=element.value;
    let countryCode=countryList[currCode];

    let newSrc=`https://flagsapi.com/${countryCode}/flat/64.png`;

    let img=element.parentElement.querySelector("img");
    img.src=newSrc;

}

btn.addEventListener("click",async (evt)=>{
    evt.preventDefault();
    let amount=document.querySelector(".amount input");
    let amtValue=amount.value.trim();
    //  console.log(amtValue);
    if(amtValue==="" || amtValue<0)
    {
        amtValue=1;
        amount.value="1";

    }
    //console.log(fromCurr.value,toCurr.value);
     

    ///
    try{
    //const url=`${BASE_URL}${fromCurr.toLowerCase}.json`;

    const url=`${BASE_URL}${fromCurr.value.toLowerCase()}.json`;



    //console.log(`Fetching exchange rates for ${fromCurr}...`);

        let response=await fetch(url);
        //console.log(response);
        if(!response.ok)
        {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        let data=await response.json();
        //console.log("API Response",data);

        //exchange rates
        const rates=data[fromCurr.value.toLowerCase()];
        if(!rates || !rates[toCurr.value.toLowerCase()]){
            throw new Error(`Exchange rate for ${fromCurr.value} to ${toCurr} not Found!`);
        }

        //extract the exchange rate
        const rate=rates[toCurr.value.toLowerCase()];
        // if(!rate)
        // {
        //     throw new Error(`Exchange rate for ${fromCurr} to ${toCurr} not found!`);
        // }

        let convertedAmt=amtValue*rate;
        console.log(`${amtValue} ${fromCurr.value} = ${convertedAmt.toFixed(2)} ${toCurr.value}`);
        msg.innerText=`${amtValue} ${fromCurr.value} = ${convertedAmt} ${toCurr.value}`;
    }
    catch(error)
    {
        console.error(`Error`,error);
    }
    
   
});

exchangeIcon.addEventListener("click",()=>{
    let tempVal=fromCurr.value;
    fromCurr.value=toCurr.value;
    toCurr.value=tempVal;

    updateFlag(fromCurr);
    updateFlag(toCurr);
});

