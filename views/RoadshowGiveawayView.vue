<template>
    <div>
        <v-form v-model="valid" ref="form">
            <v-row class="box" align="center">
                <v-col cols="12">
                    <h1 class="mb-12">Roadshow Giveaway</h1>
                    <v-text-field
                        v-model="name"
                        color="#000"
                        :rules="nameRules"
                        label="Name"
                        type="text"
                        required
                    ></v-text-field>
                    <v-text-field
                        v-model="matricNo"
                        color="#000"
                        :rules="matricRules"
                        :counter="8"
                        label="Matriculation Number (if student)"
                        type="number"
                        required
                    ></v-text-field>
                    <v-text-field
                        v-model="tele"
                        color="#000"
                        :rules="teleRules"
                        :counter="8"
                        label="Telephone"
                        type="number"
                        required
                    ></v-text-field>
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
                valid: false,
                matricNo: '',
                tele: '',
                name: '',
                nameRules: [
                    n => !!n || 'Field is required',
                ],
                matricRules: [
                    m => String(m)[0] == "0" || "Invalid matriculation number",
                    m => (!m || (!!m && m.length == 8)) || 'Matriculation number must be 8 digits long'
                ],
                teleRules: [
                    s => !!s || 'Field is required',
                    s => (String(s)[0] == "8" || String(s)[0] == "9") || "Invalid telephone number",
                    s=> (!s || (!!s && s.length == 8)) || 'Invalid telephone number'
                ],
                successList: [],
            }
        },

        methods: {
            submit() {
                const vRef = collection(db, "roadshow");
                var temp = {
                    name: this.name,
                    telephone: this.tele,
                    date: firebase.firestore.Timestamp.fromDate(new Date()),
                    email: this.$store.state.user.email
                }
                if (this.matricNo && this.matricNo.length != 0) {
                    temp['matricNum'] = this.matricNo
                }
                addDoc(vRef, temp)
                .then((snapshot) => {
                    this.successList = [];
                    this.successList.push({ name: "Name", value: this.name });
                    if (this.matricNo && this.matricNo.length != 0) {
                        this.successList.push({ name: "Matriculation Number", value: this.matricNo });
                    }
                    this.successList.push({ name: "Telephone", value: this.tele });

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