<template>
    <div>
        Redeem
    </div>
</template>
<script>
    import firebase from 'firebase/compat/app';
    import 'firebase/compat/auth';
    import 'firebase/compat/firestore';
    import { auth, db } from "../firebase/firebaseinit";
    import { getFirestore, doc, collection, query, where, onSnapshot, getDoc, getDocs, addDoc, setDoc, updateDoc, deleteDoc, orderBy } from "firebase/firestore";

    export default {
        data(){
            return {
    
            }
        },
    };
</script>

<style lang="css" scoped>
    @media only screen and (min-device-width: 411px) and (max-device-width: 823px) {
    }
    
</style>