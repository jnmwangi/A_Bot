(async function init(){
    let {configs} = await browser.storage.local.get("configs");
    if(!configs){
        configs = {canvas_hours: 4}
    }

    const canvas_hours_per_day = document.querySelector("#canvas_hours_per_day");
    console.log(configs)
    canvas_hours_per_day.value = configs.canvas_hours || 4;
    console.log(canvas_hours_per_day.value)
    canvas_hours_per_day.addEventListener("change", ()=>{
        console.log(canvas_hours_per_day.value)
        configs.canvas_hours = Number(canvas_hours_per_day.value);
        browser.storage.local.set({configs});
    })
})()