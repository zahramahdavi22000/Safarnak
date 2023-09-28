const {apiKey} = require('../configs/chatgpt.config')
const { Configuration, OpenAIApi } = require("openai")

const configuration = new Configuration({
    apiKey
});

const openai = new OpenAIApi(configuration);

async function search(inputText, tours) {

    for(let i=0;i<tours.length;i++){
        tours[i].id=i+1
    }

    let toursTexts = ""
    // tours.forEach(tour => toursTexts += `${tour.id}. ${tour.title} \n`);
    // tours.forEach(tour => toursTexts += `${tour.id}. ${tour.title} "${tour.summary.replace(/\n/g, "")}" \n`);
    tours.forEach(tour => toursTexts += `${tour.id}. ${tour.title} "${tour.summary.replace(/\n/g, "")}" "${tour.price} تومان" \n`);

    const prompt = `
        Hello Chat GPT, you have been hired as a tour advisor for our travel company.
        We have a list of tours available, and we need your help to provide quick and efficient responses to our customers.
        Please familiarize yourself with the tour list we have provided and be ready to assist our customers promptly.

        Tour List is Between three quotes :
        '''
        ${toursTexts}
        '''

        Your task is to only send list of the Tour IDs in format [tour_id1, tour_id2, ..., tour_idN] when in a customer explains which tour they are interested in.
        Please note that when responding, you should only provide the list of Tour IDs number and not any further information or details.
        If your input does not match any tours, the output list will be a empty list.
        
`
    const chatCompletion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        temperature: 0,
        messages: [ // 3 roles in chatgbt : 1) assistant :chatgbt 2)system: our site 3) user
            { role: "system", content: prompt },
            { role: "user", content: inputText }
        ],
    })

    message = chatCompletion.data.choices[0].message // the answer that chatgbt return us & choices[0] means first answer
    console.log(message);

    my_tour_id_list = JSON.parse(message.content) 
    console.log(my_tour_id_list);

    target_tours = tours.filter(tour => my_tour_id_list.includes( tour.id))

    return target_tours
}

module.exports = {search}


// If the provided text is not related to travel or does not match any tours, please respond with an empty list [].