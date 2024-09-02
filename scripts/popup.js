(async function init(){
    let {configs} = await browser.storage.local.get("configs");
    if(!configs){
        configs = {canvas_hours: 4}
    }

    const canvas_hours_per_day = document.querySelector("#canvas_hours_per_day");
    canvas_hours_per_day.value = configs.canvas_hours || 4;
    
    canvas_hours_per_day.addEventListener("change", ()=>{
        console.log(canvas_hours_per_day.value)
        configs.canvas_hours = Number(canvas_hours_per_day.value);
        browser.storage.local.set({configs});
        
        // browser.tabs
        browser.runtime.sendMessage({canvas_hours: Number(canvas_hours_per_day.value)});
    })
})()