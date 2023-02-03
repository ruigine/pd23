<template>
    <div>
        <v-form v-model="valid" ref="form">
            <v-row class="box" align="center">
                <v-col cols="12">
                    <h1 class="mb-12">Prize Redemption</h1>
                    <v-text-field
                        v-model="name"
                        color="#000"
                        :rules="nameRules"
                        label="Name"
                        type="text"
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
                    <v-row>
                        <v-col cols="8">
                            <v-select
                                v-model="prize"
                                color="#000"
                                :items="prizes"
                                label="Prize"
                                :rules="prizeRules"
                                multiple
                                required
                            ></v-select>
                        </v-col>
                        <v-col>
                            <v-switch
                                v-model="hourly"
                                label="Hourly Drop"
                                color="success"
                                hide-details
                            ></v-switch>
                        </v-col>
                    </v-row>
                    <v-autocomplete
                        v-if="prize.includes('PD23 voucher')"
                        hint="You may enter multiple S/Ns"
                        v-model="sNo"
                        no-data-text="Invalid voucher S/N"
                        :items="sNos"
                        :rules="sNoRules"
                        color="#000"
                        label="Voucher Serial Number"
                        chips
                        multiple
                        required
                    >
                        <v-tooltip
                            slot="append"
                            bottom
                            v-model="show"
                            top
                        >
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn
                                icon
                                v-bind="attrs"
                                v-on="on"
                                >
                                <v-icon color="grey lighten-1">
                                    mdi-information-outline
                                </v-icon>
                                </v-btn>
                            </template>
                            <span>Multi-select</span>
                        </v-tooltip>
                    </v-autocomplete>
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
                show: false,
                dialog: false,
                voucherList: [],
                hourly: false,
                teleList: [],
                valid: false,
                name: '',
                nameRules: [
                    n => !!n || 'Field is required',
                ],
                tele: '',
                teleRules: [
                    s => !!s || 'Field is required',
                    s => (String(s)[0] == "8" || String(s)[0] == "9") || "Invalid telephone number",
                    s => (!s || (!!s && s.length == 8)) || 'Invalid telephone number',
                    s => ( !this.hourly || (this.hourly && !this.teleList.includes(s)) ) || "Already Redeemed"
                ],
                prevSNo: [],
                sNo: [],
                sNos: [],
                sNoRules: [
                    s => s.length > 0 || 'Field is required',
                ],
                prizeRules: [
                    p => p.length > 0 || 'Field is required',
                ],
                prize: [],
                prizes: [
                    'PD23 voucher',
                    'Mystery Prize A',
                    'Mystery Prize B',
                    'Mystery Prize C'
                ],
                successList: [],
            }
        },
        created(){
            const gRef = collection(db, 'prize');
            onSnapshot(gRef, (snapshot) => {
            var v = []; var t = [];
            snapshot.docs.forEach((doc) => {
                if (doc.data().serialNum) {
                    v = v.concat(doc.data().serialNum);
                }
                if (doc.data().hourly) {
                    t.push(doc.data().telephone)
                }
            })
            this.voucherList = v;
            console.log(this.voucherList);

            this.teleList = t;
            console.log(this.teleList);

            this.sNos = (Array.from(Array(this.$prizesRange[1]+1).keys()).slice(this.$prizesRange[0])).filter( ( sn ) => !this.voucherList.includes( sn ) );
            if (this.sNo.length != 0 && !this.sNos.includes(this.sNo)) {
                this.prevSNo = this.sNo;
                this.sNo = [];
            }

            if (this.name && this.tele && this.prize) {
                this.$refs.form.validate()
            }
            });       
        },
        watch: {
            hourly() {
                this.$refs.form.validate()
            }
        },
        methods: {
            submit() {
                const gRef = collection(db, "prize");
                var temp = {
                    name: this.name,
                    telephone: this.tele,
                    prize: this.prize,
                    location: "SMOO Hub",
                    date: firebase.firestore.Timestamp.fromDate(new Date()),
                    email: this.$store.state.user.email
                }
                if (this.prize.includes('PD23 voucher')) {
                    temp['serialNum'] = this.sNo
                }
                if (this.hourly) {
                    temp['hourly'] = true
                }
                addDoc(gRef, temp)
                .then((snapshot) => {
                    this.successList = [];
                    this.successList.push({ name: "Name", value: this.name });
                    this.successList.push({ name: "Telephone", value: this.tele });
                    this.successList.push({ name: "Prize", value: this.prize.join(", ") });
                    if (this.prize.includes('PD23 voucher')) {
                        this.successList.push({ name: "Voucher Serial Number", value: this.prevSNo.join(", ") });
                    }
                    if (this.hourly) {
                        this.successList.push({ name: "Hourly Drop?", value: "Yes" });
                    }

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