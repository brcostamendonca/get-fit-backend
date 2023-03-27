const { Configuration, OpenAIApi } = require("openai");
require('dotenv').config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

exports.generateWorkout = async function (req, res) {
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

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{
        "role": "user",
        "content": generatedPrompt
      }],
      temperature: 1,
      max_tokens: 3500
    });


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
  
  Give me a workout plan for a week, adapted to my requirements:
   ${request}
  
  
  Give me an answer in valid json, with a object that has a variable for each day of the week (monday, tuesday, wednesday, thursday, friday, saturday, sunday).
  For each day of the week there should be a atribute "description" which is the descriotion of the day (including the focus and benefits, and other info), and a atribute "type" which is the type of day "leg day", "rest day" or other. And there should be a "exercices" array of objects that are the exercices and have the atributes "name", "sets", "reps", "other_info" (all as strings).
  
  I do not want formatting stuff like \\n and \\t. Make sure the json is valid, and in the correct format, and the attributes names are all lower case, correct any mistakes in your answer before you give it! `;
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
