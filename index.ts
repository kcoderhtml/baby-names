console.log("#---------------------------->\n  ","Welcome to the 👶 parser!", "\n#---------------------------->\n")

// check whether the file names.zip exists in the data directory
const exists = await Bun.file("data/names.zip").exists()

if (!exists) {
    console.log("I'm sorry but you don't seem to have downloaded the names file")
    console.log("Please download it from:", "https://www.ssa.gov/oact/babynames/names.zip")
    // exit
    process.exit(1)
}

