const q_TEXT  = "TEXT";
const q_MULTI ="MULTI";


const q_Alternative =
    {
        ID        :"q_Alternative",
        Type      : q_MULTI,
        question  : "How frequently did the level editor make you consider an alternative level design?",
        responses :
            [
                "Never", "Rarely", "Sometimes", "Frequently", "Very frequently"
            ]
    };
const q_ToUseAgain =
    {
        ID        :"q_ToUseAgain",
        Type      : q_MULTI,
        question  : "How likely are you to use this level editor when prototyping the design of a level? ",
        responses :
            [
                "Not at all likely", "Not likely", "Perhaps", "Quite likely", "Very likely"
            ]

    };
const q_Difficulty =
    {
        ID        :"q_Difficulty",
        Type      : q_MULTI,
        question  : "How difficult did you find it to make the level you wanted?",
        responses :
            [
                "Very hard", "Hard", "Neutral", "Easy", "Very easy"
            ]
    };
const q_FinalDesign =
    {
        ID        :"q_FinalDesign",
        Type      : q_MULTI,
        question  : "How satisfied are you with the final design of the level?",
        responses :
            [
                "Very dissatisfied", "Dissatisfied", "neither", "satisfied", "Very satisfied"
            ]
    };
const q_Experience =
    {
        ID        :"q_Experience",
        Type      : q_MULTI,
        question  : "How would you assess your own level design experience?",
        responses :
            [
                "Very little", "A little", "Some", "A bit", "A lot"
            ]
    };
const q_Code =
    {
        ID        : "q_Code",
        Type      : q_TEXT,
        question  : "Please enter the code for this experiment, if you have not been given a code just click enter.",
        htmlID    : "text_input",
        responses :
            [
                "Enter"
            ]
    };
const Q_START_QUESTIONS = [q_Code, q_Experience];
const Q_MAP_QUESTIONS = [q_Alternative, q_ToUseAgain, q_Difficulty, q_FinalDesign];