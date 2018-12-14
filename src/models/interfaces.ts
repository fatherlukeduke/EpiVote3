

export interface VoteChoice {
    voteChoiceID : number,
    voteChoiceDescription : string,
    smiley : string,
    colour : string,
    voteChoiceValue: number
}

export interface MeetingPatient{
    meetingPatientID : number,
    meetingID : number,
    patientNumber: number,
    votingOpen :  number
}

export interface MeetingPatientQuestion {
    meetingPatientQuestionID : number,
    meetingPatientID : number,
    meetingID : number,
    patientNumber : number,
    questionNumber : number,
    questionText : number,
    votingOpen : boolean
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

export interface VoteMessage {
    body:string,
    meetingID: number,
    meetingPatientQuestionID: number,
    patientNumber: number,
    questionNumber: number,
    questionText: string,
    title:string,
    votingOpen: string,
    wasTapped: boolean
}

export interface VoteResults {
   meetingPatientQuestionID: number,
   roleID: number,
   voteChoiceID: number,
   voteID : number,
   voteChoiceValue: number
}