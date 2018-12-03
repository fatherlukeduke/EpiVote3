

export interface VoteChoice {
    voteChoiceID : number,
    voteChoiceDescription : string,
    smiley : string,
    colour : string 
}

export interface MeetingPatientQuestion {
    meetingPatientQuestionID : number,
    meetingID : number,
    patientNumber : number,
    questionNumber : number,
    questionText : number
}

export interface Role {
    roleID : number,
    roleName: string
}

export interface Vote {
    voteChoiceID : number,
    meetingPatientQuestionID: number,
    roleID : number
}