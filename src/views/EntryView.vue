<template>
    <div class="box">
        <h1 class="mb-12">Entries</h1>
        
    </div>
</template>
<script>
    import { db } from "../firebase/firebaseinit";
    import { doc, collection, getDocs, onSnapshot, addDoc, updateDoc, query, where } from "firebase/firestore";

    export default {
        data(){
            return {
                
            }
        },
    };
</script>

<style lang="css" scoped>
    .box {
        width: 80%;
        margin: 5% auto 5% auto;
    }
</style>