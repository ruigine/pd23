<template>
    <div>
        Redeem
    </div>
</template>
<script>
    import { db } from "../firebase/firebaseinit";
    import { collection, getDocs } from "firebase/firestore";

    export default {
        data(){
            return {
                
            }
        },
        created(){
            // collection ref
            const colRef = collection(db, 'schedule')


            // real time collection
            getDocs(colRef)
            .then((snapshot) => {
                console.log(snapshot.docs)
            })
            .catch(err=>{
                console.log(err.message);
            })
        }
    };
</script>

<style lang="css" scoped>
    @media only screen and (min-device-width: 411px) and (max-device-width: 823px) {
    }
    
</style>