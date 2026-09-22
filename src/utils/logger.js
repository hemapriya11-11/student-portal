import pino from "pino";
const logger = pino({
    level:"info",
    transport:{
        target:"pino-pretty"
    }
});


export default logger;