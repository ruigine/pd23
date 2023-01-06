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
                        v-model="matricNo"
                        color="#000"
                        :rules="matricRules"
                        :counter="8"
                        label="Matriculation Number (if student)"
                        type="number"
                    ></v-text-field>
                    <v-select
                        v-model="prize"
                        color="#000"
                        :items="prizes"
                        label="Prize"
                        :rules="prizeRules"
                        multiple
                        required
                    ></v-select>
                    <v-autocomplete
                        v-if="prize.includes('PD23 voucher')"
                        v-model="sNo"
                        no-data-text="Invalid voucher S/N"
                        :items="sNos"
                        :rules="sNoRules"
                        color="#000"
                        label="Voucher Serial Number"
                        chips
                        multiple
                        required
                    ></v-autocomplete>
                    <v-select
                        v-model="location"
                        color="#000"
                        :items="items"
                        label="Location"
                        :rules="locRules"
                        required
                    ></v-select>
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
                valid: false,
                name: '',
                nameRules: [
                    n => !!n || 'Field is required',
                ],
                matricNo: '',
                matricRules: [
                    m => (!m || (!!m && m.length == 8)) || 'Matriculation number must be 8 digits long'
                ],
                sNo: '',
                sNos: [],
                sNoRules: [
                    s => !!s || 'Field is required',
                ],
                locRules: [
                    s => !!s || 'Field is required',
                ],
                items: ['Koufu', 'SOB', 'Connexion'],
                prizeRules: [
                    p => !!p || 'Field is required',
                ],
                prize: [],
                prizes: [
                    'Adidas Push up Bar in Pairs',
                    'Daily Modal Joggers',
                    "Dancer's Dream Studio 20% off Adult Group Dance Package",
                    'Ima-Sushi $5 Voucher (No min. spend) x 2',
                    'LUCID Folio Ultra Light Full Protection Case for iPad Air (2022) w/ Pencil Slot - Charcoal',
                    'MOTIF Snap 2 in 1 Magnetic Wireless charging Stand - Marble Noir',
                    'Paisley Shirt Beige (L)',
                    'PD23 voucher',
                    'Rainbow Black Shorts (M)',
                    'Rainbow Black Singlet',
                    'Self Photo Studio $15 Basic Package voucher',
                    'Sonata Black Label Bra',
                    'SSOD Sports bag',
                    'The SMU Shop 20% OFF voucher',
                ],
                location: null,
                successList: [],
            }
        },
        created(){
            const gRef = collection(db, 'prize');
            onSnapshot(gRef, (snapshot) => {
            var v = [];
            snapshot.docs.forEach((doc) => {
                if (doc.data().serialNum) {
                    v = v.concat(doc.data().serialNum);
                }
            })
            this.voucherList = v;
            console.log(this.voucherList);
            this.sNos = (Array.from(Array(2421).keys()).slice(1901)).filter( ( sn ) => !this.voucherList.includes( sn ) );

            if (this.matricNo && this.sNo && this.location) {
                this.$refs.form.validate()
            }
            });       
        },
        methods: {
            submit() {
                const gRef = collection(db, "prize");
                var temp = {
                    name: this.name,
                    prize: this.prize,
                    location: this.location,
                    date: firebase.firestore.Timestamp.fromDate(new Date()),
                    email: this.$store.state.user.email
                }
                if (this.matricNo && this.matricNo.length != 0) {
                    temp['matricNum'] = this.matricNo
                }
                if (this.prize.includes('PD23 voucher')) {
                    temp['serialNum'] = this.sNo
                }
                addDoc(gRef, temp)
                .then((snapshot) => {
                    this.successList = [];
                    this.successList.push({ name: "Name", value: this.name });
                    if (this.matricNo && this.matricNo.length != 0) {
                        this.successList.push({ name: "Matriculation Number", value: this.matricNo });
                    }
                    this.successList.push({ name: "Prize", value: this.prize.join(", ") });
                    if (this.prize.includes('PD23 voucher')) {
                        this.successList.push({ name: "Voucher Serial Number", value: this.sNo.join(", ") });
                    }
                    this.successList.push({ name: "Location", value: this.location });

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