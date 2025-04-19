export interface signinPayLoad{
    email:string;
    password:string;
}

export interface RegisterPayload {
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    confirmPassword?:string
}
export interface suspendPayload {
    publicId:string
}


export interface searchPayload {
    query: string;
  }