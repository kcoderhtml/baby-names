import extract from "extract-zip";

console.log(
  "#---------------------------->\n  ",
  "Welcome to the 👶 parser!",
  "\n#---------------------------->\n"
);

// check whether the file names.zip exists in the data directory
const exists = await Bun.file("data/names.zip").exists();

if (!exists) {
  console.log("I'm sorry but you don't seem to have downloaded the names file");
  const url = "https://www.ssa.gov/oact/babynames/names.zip";
  console.log("Downloading it from:", url);

  const file = await fetch(url);
  await Bun.write("data/names.zip", file);
}

console.log("... Loading data/names.zip\n");
console.log("Loaded\n");

// check if its extracted
const extracted = await Bun.file("data/names/NationalReadMe.pdf").exists();

if (!extracted) {
  // extract the zip file
  console.log("... Extracting data/names.zip");
  const localDir = process.cwd();
  console.log("extracting to", localDir + "/data/names/");
  await extract("data/names.zip", { dir: localDir + "/data/names/" });
  console.log("succesfully extracted data!\n");
}
