const { Configuration, OpenAIApi } = require("openai");
require('dotenv').config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

exports.generateMealPlan = async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const request = req.body.request || '';
  try {

    var generatedPrompt = generatePrompt(request);
    console.log(generatedPrompt);

    const response = await openai.createChatCompletion ({
      model: "gpt-3.5-turbo",
      messages: [{
        "role": "user",
        "content": generatedPrompt
      }],
      temperature: 1,
      max_tokens: 3500
    });

    // console.log("response: ");
    // console.log(response);
    // console.log("\n\n\n\n\ choices: ");
    // console.log(response.choices);
    // console.log("\n\n\n\n\ data: ");
    // console.log(response.data);
    // console.log("\n\n\n\n\ content: ");
    // console.log(response.data.choices[0].message.content);


    var myResult = makeValidJSON(response.data.choices[0].message.content)
    res.status(200).json({ result: myResult });
  } catch (error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(request) {

  return `
  
  Give me a meal plan for a single day, adapted to my requirements:
   ${request}
  
  
  Give me an answer in valid json, the return should be an array where each object represents a meal of the day.
  Each meal should have a atribute "name".
  Each meal should have a field "recipe", and the recipe should have a field "description", a field "preparation" and an array of ingredients called "ingredients". Each ingredient should have "name" (as string), "quantity" (as string) and "quantity_units" (as string).
  Each meal should also have an object "nutritional_value" containing the nutritional value of the meal, including the parameters (all strings) "calories" (kcal), "protein" (grams), "fat" (grams), "carbs" (grams). There should also be a field "nutrional_calculation" explaing the math behind each nutrional value parameter.

  I do not want formatting stuff like \n and \t. Make sure the json is valid, and in the correct format, and the attributes names are all lower case, correct any mistakes in your answer before you give it! Verify it is in valid json format! (only acceptable if it is!, if not fix it) `;

}

function makeValidJSON(text) {
  try {
    // parse the input text to check if it's already valid JSON
    var result = JSON.parse(text);
    console.log(result);
    return result;
    // if it's already valid, just return it
    // return JSON.stringify(obj, null, 2);
  } catch (error) {
    // if it's not valid JSON, return an error message
    console.error("Error: input is not valid JSON", text);
    return text;
  }
}
