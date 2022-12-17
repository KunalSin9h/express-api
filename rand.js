setTimeout(() => {
    throw new Error("Hello");
}, 1000);

process.on('uncaughtException', () => {
    console.log("EXp")
})
