import Cookies from 'universal-cookie';
 
export function getAccessToken (){
    const cookies = new Cookies();  
    const auth = cookies.get('auth')
    if(!auth) return
    return auth.token
}