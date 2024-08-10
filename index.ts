import extract from "extract-zip";
import { readdir } from "node:fs/promises";

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

// list how many years of data is contained in the export this is found by all the files in the data/names dir that have the pattern yobxxxx.txt
const files = (await readdir("data/names"))
  .filter((file) => file.match(/yob\d{4}.txt/))
  .map((year) => parseInt(year.replace("yob", "").replace(".txt", "")));

console.log(
  "loaded",
  files.length,
  "years of data from",
  files[0],
  "to",
  files[files.length - 1]
);

const prompt = "search for something: ";
process.stdout.write(prompt);
for await (const line of console) {
  console.log(`searching for: ${line}`);
  const results = (await searchYears(line)).sort((a, b) => b.year - a.year);
  console.log(
    `${results
      .map((result) => `${result.year}: ${result.count}`)
      .join("\n")}\nthe name "${line}" was found in ${
      results.length
    } years at total of ${results.reduce(
      (acc, result) => acc + result.count,
      0
    )} times`
  );
  process.stdout.write(prompt);
}

async function searchYears(term: string) {
  let searchResults: { year: number; count: number }[] = [];
  for (const year of files) {
    // check whether that term appears in the file
    const file = await Bun.file("data/names/yob" + year + ".txt").text();
    const matches = file.matchAll(new RegExp(term, "gi"));

    let searchResult = { year, count: 0 };
    for (const match of matches) {
      searchResult.count++;
    }

    if (searchResult.count > 0) {
      searchResults.push(searchResult);
    }
  }

  return searchResults;
}
