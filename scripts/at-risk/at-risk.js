async function highlightAtRisk() {
    console.log("testing")
    const table = document.querySelector("table");

    // Wait until the table of users renders
    if (!table) {
        setTimeout(highlightAtRisk, 100);
        return;
    }

    const expectedHours = await getExpectedHours();
    const tableHeaderColumns = [];
    const tr = table.querySelectorAll("thead th").forEach(th => tableHeaderColumns.push(th.innerText));
    table.querySelectorAll("tbody tr").forEach(row => {
        let cols = row.querySelectorAll("td");
        let role = cols[tableHeaderColumns.indexOf("Role")].innerText;

        if (role !== "Student") return;

        let studentName = cols[tableHeaderColumns.indexOf("Name")].innerText;
        let studentEmail = cols[tableHeaderColumns.indexOf("Login ID")].innerText;
        let timeColumn = cols[tableHeaderColumns.indexOf("Total Activity")]
        // console.log(timeColumn.innerHTML);
        // time spent
        const [hr, min, sec] = timeColumn.innerText.split(":");
        const pd = hr / expectedHours;
        const div = timeColumn.querySelector('div');
        div.style.padding = "5px";
        div.style.display = "flex";
        div.style.alignItems = "center";

        div.innerHTML += ` of <span style="margin:0 5px">${expectedHours}</span> ${svgDonut(pd)}`;

        if (pd <= 0.2) {
            div.style.backgroundColor = `rgba(255, 0, 0, 1)`;
            extreemAtRiskStudents.push({
                studentName,
                studentEmail,
                time: [hr, min, sec],
                percentage: pd
            })
        }
        else if (pd <= 0.3) div.style.backgroundColor = `rgba(255, 0, 0, .4)`;
        else if (pd <= 0.6) div.style.backgroundColor = `rgba(255, 255, 0, .4)`;

        const img = cols[0].querySelector("img");
        if (img) {
            const src = img.src;
            let style = `background:url(${src}) center center; background-size:100%;` +
                `height:48px;width:48px;border-radius:100%;`;
            cols[0].innerHTML = `<div style="${style}">
                ${svgDonut(pd, "39FF14", 48)}
            </div>`;
        }

    });
}

async function getExpectedHours() {
    let { configs } = await browser.storage.local.get("configs");
    if (!configs) {
        configs = { canvas_hours: 4 }
        browser.storage.local.set({ configs })
    }

    const course = await courseInfo();
    const courseStartDate = new Date(course.start_at);
    let now = new Date();
    let expectedTime = now.getTime() - courseStartDate.getTime();
    const expectedTimeOnCanvasPerDay = configs.canvas_hours * 60 * 60 * 1000;
    // Remove the weekends time by getting the weeks the course takes minus hoursExpectedPerDay * 2days * weeks
    const weeks = Math.floor(expectedTime / (7 * expectedTimeOnCanvasPerDay))
    expectedTime -= expectedTimeOnCanvasPerDay * 2 * weeks;

    return Math.floor(expectedTime / expectedTimeOnCanvasPerDay);
}

async function courseInfo() {
    var url = window.location.href;
    var urlParts = url.split("/");
    if (urlParts.includes("courses")) {
        var courseId = urlParts[urlParts.indexOf("courses") + 1];
        const { host, protocol } = window.location;
        return await fetch(`${protocol}//${host}/api/v1/courses/${courseId}`).then(resp => resp.json());
    }
    return null;
}

function svgDonut(percentage, color='39FF14', size = 16) {
    const c = color || (percentage >= 0.3 ? 'ff0000' : 'ffffff');
    return `<svg viewBox='0 0 32 32' style="width:${size}px;height:${size}px;border-radius:50%">
    <g stroke-width='10'>
      <circle style="fill:transparent;" cx='16' cy='16' r='16' stroke-dasharray='${percentage * 100} 100' stroke-dashoffset='0' stroke='#${c}'></circle>
    </g>
    
</svg>`;
}

const extreemAtRiskStudents = [];
// browser.scripting.sendMessage();
//initialize
highlightAtRisk();

// listen to configuration change
browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log(request, sender)
});