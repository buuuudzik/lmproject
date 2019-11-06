// Filter array with elements by specific text properties
export const filterByProperties = (table, keyword, properties) => {
    keyword = keyword.toLowerCase();
    return table.filter(el => {
        return properties.findIndex(prop => {
            let matched = false;

            try {
                matched = el[prop].toLowerCase().match(keyword.toLowerCase());
            } catch(err) {
                matched = false;
            }

            return matched;
        }) > -1;
    });
}

const weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
];

export const printDate = unixtime => {
    if (!unixtime) unixtime = Date.now();
    const dt = new Date(unixtime);
    return dt.toDateString();
}

export const printLogDate = unixtime => {
    if (!unixtime) unixtime = Date.now();
    const dt = new Date(unixtime);
    const day = dt.getDate();
    const month = dt.getMonth() + 1;
    const year = dt.getFullYear();
    return `${addZero(day)}-${addZero(month)}-${year}`;
}

const addZero = num => `${num < 10 ? "0" : ""}${num}`;

export const printSimpleDate = unixtime => {
    // FRI 21.09:
    const dt = new Date(unixtime);
    const weekday = weekdays[dt.getDay()];
    const day = dt.getDate();
    const month = dt.getMonth() + 1;
    return `${weekday.slice(0, 3)} ${day}.${addZero(month)}`;
}

export const getDate = unixtime => {
    const dt = new Date(unixtime);
    return `${dt.getFullYear()}-${addZero(dt.getMonth() + 1)}-${addZero(dt.getDate())}`;
}

export const getTime = date => new Date(date).getTime();

export const capitilize = text => [...text].map((char, i) => char[i === 0 ? "toUpperCase" : "toLowerCase"]()).join("");

export const generateId = (salt = "") => {
    const now = Date.now();
    const randomPart = Math.floor(Math.random() * 1000000);
    if (typeof salt !== "string") salt = "";
    return `${now}${randomPart}${salt}`;
};

export const extractConfig = state => {
    return {
        todos: state.todos,
        warnings: state.warnings,
        logs: state.logs
    };
};

export const downloadBackup = config => {
    let configString = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(extractConfig(config)));
    let downloadBackupAnchor = document.getElementById('downloadBackup');
    downloadBackupAnchor.setAttribute("href", configString);
    downloadBackupAnchor.setAttribute("download", `lmproject_backup_${printDate()}.json`);
    downloadBackupAnchor.click();
};

export const showOverview = element => {
    const { subject, description, duration, tools, deadline, planned } = element;
    const sep = "\n\r\n\r";
    let overview = subject;
    if (description) overview += `${sep}${description}`;
    if (duration) overview += `${sep}Duration: ${duration}h`;
    if (tools) overview += `${sep}Tools: ${tools}`;
    if (planned) overview += `${sep}Planned at: ${printDate(planned)}`;
    if (deadline) overview += `${sep}Deadline at: ${printDate(deadline)}`;
    return overview;
}