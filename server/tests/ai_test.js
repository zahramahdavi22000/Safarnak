const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
    apiKey: 'your openAi key',
});

const openai = new OpenAIApi(configuration);

let tours = [
    { id: 1, name: "تور تفریحی پاریس", description: "برگذاری ماه خرداد-درجه سختی 3 - وسیله نقلیه هواپیما-۵۰ میلیون تومان" },
    { id: 2, name: "تور تفریحی توکیو", description: "برگذاری ماه تیر-درجه سختی 3 - وسیله نقلیه هواپیما-۷۰ میلیون تومان" },
    { id: 3, name: "تور گشت و گذار امازون", description: "برگذاری ماه تیر-درجه سختی 4 - وسیله نقلیه کشتی-۶۰ میلیون تومان" },
    { id: 4, name: "تور سفر ماه", description: "برگذاری ماه خرداد-درجه سختی 5 - وسیله نقلیه فضاپیما-۱۰۰ میلیون تومان" },
    { id: 5, name: "تور گشت و گذار شیراز", description: "برگذاری ماه خرداد-درجه سختی 3 - وسیله نقلیه اوتوبوس-۵ میلیون تومان" },
    { id: 6, name: "تور گشت و گذار تهران", description: "برگذاری ماه مرداد-درجه سختی 1 - وسیله نقلیه اتوبوس-۵ میلیون تومان" },
    { id: 7, name: "تور بازدیدی دامنه سبلان", description: "برگذاری ماه مرداد-درجه سختی 4 - وسیله نقلیه سواری-۱۰ میلیون تومان" },
    { id: 8, name: "تور تفریحی ونیز", description: "برگذاری ماه مرداد-درجه سختی 3 - وسیله نقلیه هواپیما-۳۰ میلیون تومان" },
    { id: 9, name: "تور تفریحی جنگل های شمال", description: "برگذاری ماه مرداد-درجه سختی 4 - وسیله نقلیه سواری-۳ میلیون تومان" },
]

let expectedPrompts = [
    { testId: "T-01", expectedIds: [3, 7, 9], prompt: "تور هایی رو بیار که حال و هوای طبیعیت داره" },
    { testId: "T-02", expectedIds: [1, 2, 3, 5, 6, 7, 8, 9], prompt: "تور هایی رو برام بیار که درجه سختیشون بین عدد 0 تا خود 4 هستش" },
    { testId: "T-03", expectedIds: [2], prompt: "تور هایی رو بیار که در داخل ژاپن برگذار میشن" },
    { testId: "T-04", expectedIds: [1, 4, 5], prompt: "تور هایی رو بیار که در ماه خرداد برگذار میشن" },
    { testId: "T-05", expectedIds: [1, 2, 4, 8], prompt: "تور هایی رو بیار که وسیله نقلیشون سریعه" },
    { testId: "T-06", expectedIds: [7], prompt: "تور تبریز یا دامنه سبلان دارید ؟" },
    { testId: "T-07", expectedIds: [], prompt: "هوا چقدر گرمه" },
]

function sleep(timeout) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, timeout * 1000);
    })
}

function createToursIntroPrompt(tours) {
    let tourListTxt = ""

    tours.forEach(tour => tourListTxt += `${tour.id}. ${tour.name} ${tour.description}`);

    const prompt = `
    Hello Chat GPT, you have been hired as a tour advisor for our travel company.
    We have a list of tours available, and we need your help to provide quick and efficient responses to our customers.
    Please familiarize yourself with the tour list we have provided and be ready to assist our customers promptly.
    
    Tour List is Between three quotes :
    '''
    ${tourListTxt}
    '''
    
    Your task is to only send list of the Tour IDs in format [tour_id1, tour_id2, ..., tour_idN] when in a customer explains which tour they are interested in.
    Please note that when responding, you should only provide the list of Tour IDs number and not any further information or details and any other texes and any other question.
    If your input does not match any tours or when it is empty, the output list will be a empty list [].
    `

    return prompt
}

async function run() {
    let toursIntroPrompt = createToursIntroPrompt(tours)

    expectedPrompts.forEach(async (expectedPrompt, index) => {

        await sleep(index * 20)

        const chatCompletion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            temperature: 0,
            messages: [
                { role: "system", content: toursIntroPrompt },
                { role: "user", content: expectedPrompt.prompt }
            ],
        });

        let message = chatCompletion.data.choices[0].message

        let result_tour_list = []

        try {
            result_tour_list = JSON.parse(message.content)
        } catch (e) {
            console.log("error with pars json this message -> ", message.content)
            console.error(e)
        }

        result_tour_list.sort()
        expectedPrompt.expectedIds.sort()

        let test_result = JSON.stringify(result_tour_list) == JSON.stringify(expectedPrompt.expectedIds) ? "OK" : "NOK"

        console.log()
        console.log(`Test[${expectedPrompt.testId}] is ${test_result}`)
        console.log(`expectedIds       => ${expectedPrompt.expectedIds}`)
        console.log(`result_tour_list  => ${result_tour_list}`)
        console.log(`message           => ${message.content}`)
        console.log()

    });
}

run()