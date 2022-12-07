<template>
    <div>
        <v-form v-model="valid" ref="form">
            <v-row class="box" align="center">
                <v-col cols="12">
                    <h1 class="mb-12">Games Voucher</h1>
                    <v-text-field
                        v-model="sNo"
                        color="#000"
                        :rules="sNoRules"
                        label="Voucher Serial Number"
                        type="number"
                        required
                    ></v-text-field>
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
                sNo: '',
                sNoRules: [
                    s => !!s || 'Field is required',
                    s => this.voucherList.includes(s) || 'Voucher does not exist/is unavailable',
                ],
            }
        },
        created(){
            const vRef = collection(db, 'vouchers');
            onSnapshot(vRef, (querySnapshot) => {
            var v = [];
            querySnapshot.docs.forEach((doc) => {
                if (doc.data().isAvailable) {
                    v.push(doc.data().serialNum);
                }
            })
            this.voucherList = v;
            });
        },
        methods: {
            submit() {
                getDocs(query(collection(db, 'vouchers'), where("serialNum", "==", this.sNo)))
                .then((snapshot) => {
                    var v = "";
                    snapshot.docs.forEach((doc) => {
                        v = doc.id;
                    })
                    const vRef = doc(db, "vouchers", v);
                    updateDoc(vRef, {
                        distributionMethod: "games",
                        isAvailable: false,
                        uid: this.$store.state.user.uid,
                    })
                    .then((snapshot) => {
                        this.dialog = true;
                        this.$refs.form.reset();
                    })
                    .catch(err => {
                        console.log(err);
                    })
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
        margin: 0 300px;
    }
</style>