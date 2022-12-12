<template>
    <div>
        <v-form v-model="valid" ref="form">
            <v-row class="box" align="center">
                <v-col cols="12">
                    <h1 class="mb-12">Games Redemption</h1>
                    <v-text-field
                        v-model="matricNo"
                        color="#000"
                        :rules="matricRules"
                        :counter="8"
                        label="Matriculation Number"
                        type="number"
                        required
                    ></v-text-field>
                    <v-text-field
                        v-model="sNo"
                        color="#000"
                        :rules="sNoRules"
                        label="Voucher Serial Number"
                        type="number"
                        required
                    ></v-text-field>
                    <v-select
                        v-model="location"
                        color="#000"
                        :items="items"
                        label="Location"
                        :rules="locRules"
                        required
                    ></v-select>
                    <v-btn v-if="valid" class="mt-6" @click="submit" color="#fff">Submit</v-btn>
                    <v-btn v-else class="mt-6" disabled>Submit</v-btn>
                </v-col>
            </v-row>
        </v-form>

        <v-dialog
            max-width="600"
            v-model="dialog"
        >
            <v-card>
                <v-card-text class="text-center">
                    <v-icon class="py-12" color="success" size="100" style="opacity: 0.4">mdi-check-circle-outline</v-icon>
                    <div class="text-h5">Update successful!</div>
                </v-card-text>
                <v-card-actions class="justify-end">
                <v-btn
                    text
                    @click="dialog = !dialog"
                >Close</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
    import { db } from "../firebase/firebaseinit";
    import firebase from 'firebase/compat/app';
    import 'firebase/compat/auth';
    import 'firebase/compat/firestore';
    import { doc, collection, getDocs, onSnapshot, addDoc, updateDoc, query, where } from "firebase/firestore";

    export default {
        data(){
            return {
                dialog: false,
                voucherList: [],
                valid: false,
                matricNo: '',
                matricRules: [
                    m => !!m || 'Field is required',
                    m => (m && m.length == 8) || 'Matriculation number must be 8 digits long',
                    m => this.matricList.includes(m) == false || 'Matriculation number is already in database',
                ],
                sNo: '',
                sNoRules: [
                    s => !!s || 'Field is required',
                    s => (1901 <= Number(s) && Number(s) <= 2420) || 'Invalid voucher S/N',
                    s => this.voucherList.includes(s) == false || 'Voucher has already been redeemed',
                ],
                locRules: [
                    s => !!s || 'Field is required',
                ],
                items: ['Koufu', 'SOB', 'Connexion'],
                location: null,
            }
        },
        created(){
            const gRef = collection(db, 'games');
            onSnapshot(gRef, (snapshot) => {
            var v = []; var m = [];
            snapshot.docs.forEach((doc) => {
                v.push(doc.data().serialNum);
                m.push(doc.data().matricNum);
            })
            this.voucherList = v;
            console.log(this.voucherList);

            this.matricList = m;
            console.log(this.matricList);
            if (this.matricNo && this.sNo && this.location) {
                this.$refs.form.validate()
            }
            });       
        },
        methods: {
            submit() {
                const gRef = collection(db, "games");
                addDoc(gRef, {
                    serialNum: this.sNo,
                    matricNum: this.matricNo,
                    location: this.location,
                    date: firebase.firestore.Timestamp.fromDate(new Date()),
                    email: this.$store.state.user.email
                })
                .then((snapshot) => {
                    this.dialog = true;
                    this.$refs.form.reset();
                })
                .catch(err => {
                    console.log(err);
                })
            }
        }
    };
</script>

<style lang="css" scoped>
    .box {
        height: calc(100vh - 64px);
        width: 70%;
        margin: 0 auto 0 auto;
    }
</style>