export class Utils {
    static ResolveError(e):string{
        if(!e){
            return "nil"
        }
        if(e.error){
            return e.error.description;
        }else if(e.message){
            return e.message;
        }
        return "unknow";
    }
}
