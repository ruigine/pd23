<template>
    <div>
        <v-form v-model="valid" ref="form">
            <v-row class="box" align="center">
                <v-col cols="12">
                    <h1 class="mb-12">Voucher Redemption</h1>
                    <v-text-field
                        v-model="matricNo"
                        color="#000"
                        :rules="matricRules"
                        :counter="8"
                        label="Matriculation Number"
                        type="number"
                        required
                    ></v-text-field>
                    <v-autocomplete
                        v-model="sNo"
                        no-data-text="Invalid voucher S/N"
                        :items="sNos"
                        color="#000"
                        :rules="sNoRules"
                        label="Voucher Serial Number"
                        chips
                        required
                    ></v-autocomplete>
                    <v-btn v-if="valid" class="mt-6" @click="submit" color="#d4ecd6">Submit</v-btn>
                    <v-btn v-else class="mt-6" disabled>Submit</v-btn>
                </v-col>
            </v-row>
        </v-form>

        <v-dialog
            max-width="600"
            v-model="dialog"
        >
            <v-card>
                <div class="pt-8 pb-6 text-h5 text-center">
                <v-icon color="success" size="40" style="opacity: 0.4">mdi-check-circle-outline</v-icon> Update successful!
                </div>

                <v-list-item class="px-8" two-line v-for="(item, idx) in successList" :key="idx">
                    <v-list-item-content>
                        <v-list-item-title>{{item.name}}</v-list-item-title>
                        <v-list-item-subtitle>{{item.value}}</v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
                
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
                matricList: [],
                valid: false,
                matricNo: '',
                sNo: '',
                sNos: [],
                matricRules: [
                    m => !!m || 'Field is required',
                    m => String(m)[0] == "0" || "Invalid matriculation number",
                    m => (m && m.length == 8) || 'Matriculation number must be 8 digits long',
                    m => this.matricList.includes(m) == false || 'Matriculation number is already in database',
                ],
                sNoRules: [
                    s => !!s || 'Field is required',
                ],
                successList: [],
            }
        },
        created(){
            const vRef = collection(db, 'vouchers');
            onSnapshot(vRef, (snapshot) => {
            var v = []; var m = [];
            snapshot.docs.forEach((doc) => {
                v.push(doc.data().serialNum);
                m.push(doc.data().matricNum);
            })
            this.voucherList = v;

            this.sNos = (Array.from(Array(this.$vouchersRange[1]+1).keys()).slice(this.$vouchersRange[0])).filter( ( sn ) => !this.voucherList.includes( sn ) );

            this.matricList = m;
            if (this.matricNo && this.sNo) {
                this.$refs.form.validate()
            }
            }); 
        },
        methods: {
            submit() {
                const vRef = collection(db, "vouchers");
                addDoc(vRef, {
                    serialNum: this.sNo,
                    matricNum: this.matricNo,
                    location: "SMOO Hub",
                    date: firebase.firestore.Timestamp.fromDate(new Date()),
                    email: this.$store.state.user.email
                })
                .then((snapshot) => {
                    this.successList = [];
                    this.successList.push({ name: "Voucher Serial Number", value: this.sNo });
                    this.successList.push({ name: "Matriculation Number", value: this.matricNo });

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