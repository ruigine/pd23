<template>
    <div>
        <v-form v-model="valid" ref="form">
            <v-row class="box" align="center">
                <v-col cols="12">
                    <h1 class="mb-12">HOTO</h1>

                    <v-text-field
                        v-model="sNoStart"
                        color="#000"
                        :rules="sNoStartRules"
                        label="Voucher Serial Numbers at the Start"
                        hint="i.e.: 3000 or i.e.: 2000-2030, 2060-2080"
                        required
                    ></v-text-field>

                    <v-row>
                        <v-col>
                            <v-text-field
                                v-model="sNoEnd"
                                color="#000"
                                :rules="sNoEndRules"
                                label="Voucher Serial Numbers at the End"
                                hint="i.e.: 3000 or i.e.: 2000-2030, 2060-2080"
                                required
                            ></v-text-field>
                        </v-col>
                    </v-row>

                    <v-row>
                        <v-col>
                            <v-text-field
                                type="datetime-local"
                                color="#000"
                                v-model="startTime"
                                label="Start Date"
                                :rules="startRules"
                            ></v-text-field>
                        </v-col>

                        <v-col>
                            <v-text-field
                                type="datetime-local"
                                color="#000"
                                v-model="endTime"
                                label="End Date"
                                :rules="endRules"
                            ></v-text-field>
                        </v-col>
                    </v-row>

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
                startTime: null,
                endTime: null,
                dialog: false,
                valid: false,
                sNoStart: "",
                sNoEnd: "",
                sNoStartRules: [
                    s => !!s || 'Field is required',
                    s => this.checkFormat(s) || 'Please enter a number or use the following format i.e. 3000-3040',
                    s => (this.checkFormat(s) && this.checkOrder(s)) || 'Invalid ranges/vouchers'
                ],
                sNoEndRules: [
                    s => (s=="" || this.checkFormat(s)) || 'Please enter a number or use the following format i.e. 3000-3040',
                    s => (s=="" || (this.checkFormat(s)) && this.checkOrder(s)) || 'Invalid ranges/vouchers'
                ],
                locRules: [
                    l => !!l || 'Field is required',
                ],
                startRules: [
                    s => !!s || 'Field is required',
                ],
                endRules: [
                    e => !!e || 'Field is required',
                    e => (e && this.dateOrder()) || 'End date must be after start date',
                ],
                items: ['Koufu', 'SOB', 'Connexion'],
                location: null,
                successList: [],
            }
        },
        methods: {
            checkFormat(s) {
                if (isNaN(s.split(", ").join("-").split("-").join(""))) {
                    return false;
                }
                var sArr = s.replaceAll(",", " ").trim(" ").split("  ");
                
                if (sArr.length == 1 && sArr[0].split("-").length == 1) {
                    return true;
                } else {
                    for (var str of sArr) {
                        if (str.split("-").length != 1 && str.split("-").length != 2) {
                            return false;
                        }
                    }
                }
                return true;
            },
            checkOrder(s) {
                var sArr = s.replaceAll(",", " ").trim(" ").split("  ");

                if (sArr.length == 1 && sArr[0].split("-").length == 1) {
                    if (!((Number(sArr[0]) >= 1901 && Number(sArr[0]) <= 2420) || (Number(sArr[0]) >= 2421 && Number(sArr[0]) <= 5880))) {
                        return false;
                    }
                } else {
                    for (var str of sArr) {
                        var range = str.split("-");
                        if (range.length == 1) {
                            if (!((Number(sArr[0]) >= 1901 && Number(sArr[0]) <= 2420) || (Number(sArr[0]) >= 2421 && Number(sArr[0]) <= 5880))) {
                                return false;
                            }
                        } else {
                            if (Number(range[1]) < Number(range[0])) {
                                return false;
                            } else {
                                if (!((Number(range[0]) >= 1901 && Number(range[1]) <= 2420) || (Number(range[0]) >= 2421 && Number(range[1]) <= 5880))) {
                                    return false;
                                }
                            }
                        }
                    }
                }
                return true;
            },
            dateOrder() {
                if (new Date(this.endTime).getTime() > new Date(this.startTime).getTime()) {
                    return true;
                } else {
                    return false;
                }
            },
            submit() {
                addDoc(collection(db, 'hoto'), {
                    location: this.location,
                    serialNumStart: this.sNoStart.replaceAll(",", " ").trim(" ").split("  ").join(", "),
                    serialNumEnd: this.sNoEnd.replaceAll(",", " ").trim(" ").split("  ").join(", "),
                    startTime: firebase.firestore.Timestamp.fromDate(new Date(this.startTime)),
                    endTime: firebase.firestore.Timestamp.fromDate(new Date(this.endTime)),
                    email: this.$store.state.user.email
                })
                .then((snapshot) => {
                    this.successList = [];
                    this.successList.push({ name: "Voucher Serial Number at the Start", value: this.sNoStart.replaceAll(",", " ").trim(" ").split("  ").join(", ") });
                    this.successList.push({ name: "Voucher Serial Number at the End", value: this.sNoEnd.replaceAll(",", " ").trim(" ").split("  ").join(", ") });
                    this.successList.push({ name: "Start Date", value: this.startTime });
                    this.successList.push({ name: "End Date", value: this.endTime });
                    this.successList.push({ name: "Location", value: this.location });

                    this.dialog = true;
                    this.$refs.form.reset();
                    this.sNoStart = "";
                    this.sNoEnd = "";
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