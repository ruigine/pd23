<template>
    <div>
        <v-form v-model="valid" ref="form">
            <v-row class="box" align="center">
                <v-col cols="12">
                    <h1 class="mb-12">HOTO</h1>

                    <v-text-field
                        v-model="sNoStart"
                        color="#000"
                        :rules="sNoRules"
                        label="Voucher Serial Numbers at the Start"
                        hint="i.e.: 2000-2030, 2060, 2080"
                        required
                    ></v-text-field>

                    <v-row>
                        <v-col>
                            <v-text-field
                                v-model="sNoEnd"
                                color="#000"
                                :rules="sNoRules"
                                label="Voucher Serial Numbers at the End"
                                hint="i.e.: 2000-2030, 2060, 2080"
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
                startTime: null,
                endTime: null,
                dialog: false,
                valid: false,
                sNoStart: "",
                sNoEnd: "",
                sNoRules: [
                    s => !!s || 'Field is required',
                    s => this.checkFormat(s) || 'Please use the following format i.e. 3000-3040',
                    s => (this.checkFormat(s) && this.checkOrder(s)) || 'Invalid ranges/vouchers'
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
            }
        },
        methods: {
            checkFormat(s) {
                if (isNaN(s.split(", ").join("-").split("-").join(""))) {
                    return false;
                }
                var sArr = s.replaceAll(",", " ").trim(" ").split("  ");

                for (var str of sArr) {
                    if (str.split("-").length != 2) {
                        return false;
                    }
                }
                return true;
            },
            checkOrder(s) {
                var sArr = s.replaceAll(",", " ").trim(" ").split("  ");

                for (var str of sArr) {
                    var range = str.split("-");
                    if (range[1] < range[0]) {
                        return false;
                    } else {
                        if ((range[0] >= 1901 && range[1] <= 2420) || (range[0] >= 2541 && range[1] <= 6000)) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                }
            },
            dateOrder() {
                if (new Date(this.endTime).getTime() > new Date(this.startTime).getTime()) {
                    return true;
                } else {
                    return false;
                }
            },
            submit() {
                addDoc(collection(db, 'hotoDB'), {
                    location: this.location,
                    serialNumStart: this.sNoStart.replaceAll(",", " ").trim(" ").split("  ").join(", "),
                    serialNumEnd: this.sNoEnd.replaceAll(",", " ").trim(" ").split("  ").join(", "),
                    startTime: firebase.firestore.Timestamp.fromDate(new Date(this.startTime)),
                    endTime: firebase.firestore.Timestamp.fromDate(new Date(this.endTime)),
                    email: this.$store.state.user.email
                })
                .then((snapshot) => {
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