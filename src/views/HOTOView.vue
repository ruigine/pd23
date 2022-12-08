<template>
    <div>
        <v-form v-model="valid" ref="form">
            <v-row class="box" align="center">
                <v-col cols="12">
                    <h1 class="mb-12">HOTO</h1>

                    <v-row>
                        <v-col class="mb-4">
                            <p style="color: grey" class="float-left">Voucher Serial Numbers</p>
                            <v-btn class="float-right" x-small text color="blue" @click="add"><v-icon>mdi-plus</v-icon></v-btn>
                            <v-btn class="float-right" x-small text color="blue" @click="remove"><v-icon>mdi-minus</v-icon></v-btn>
                        </v-col>
                    </v-row>

                    <vue-slider
                        :tooltip="'always'"
                        ref="slider"
                        v-model="value"
                        v-bind="options"
                    >
                        <template v-slot:tooltip="{ value, focus }">
                            <div :class="['custom-tooltip', { focus }]" style="font-size: 12px; color: #a6a6a6;">{{ value }}</div>
                        </template> 
                    </vue-slider>
                    <hr class="my-2"/>
                    <p style="font-size: 12px;">Vouchers {{Array.from({length:value.length/2}, (_,i)=>[value[2*i], value[2*i+1]].join("-")).join(", ")}}</p>

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

    import VueSlider from 'vue-slider-component'
    import 'vue-slider-component/theme/antd.css'

    export default {
        components: {
            VueSlider,
        },
        data(){
            return {
                startTime: null,
                endTime: null,
                dialog: false,
                voucherList: [],
                valid: false,
                locRules: [
                    l => !!l || 'Field is required',
                ],
                dateRules: [
                    s => !!s || 'Field is required',
                ],
                startRules: [
                    s => !!s || 'Field is required',
                ],
                endRules: [
                    e => !!e || 'Field is required',
                ],
                items: ['Koufu', 'SOB', 'Connexion'],
                location: null,
                value: [100, 400],
                options: {
                    min: 0,
                    max: 6020,
                    process: pos => Array.from({length:pos.length/2}, (_,i)=>[pos[2*i], pos[2*i+1]]),
                    enableCross: true
                }
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
            add() {
                if (this.value[this.value.length-1] + 150 <= this.options.max) {
                    this.value.push(this.value[this.value.length-1] + 150);
                } else {
                    this.value.push(this.options.max);
                }
                if (this.value[this.value.length-1] + 150 <= this.options.max) {
                    this.value.push(this.value[this.value.length-1] + 150);
                } else {
                    this.value.push(this.options.max);
                }
            },
            remove() {
                if (this.value.length >= 4) {
                    this.value.pop();
                    this.value.pop();
                }
            },
            submit() {
                addDoc(collection(db, 'hotoDB'), {
                    location: this.location,
                    serialNums: Array.from({length:this.value.length/2}, (_,i)=>[this.value[2*i], this.value[2*i+1]].join("-")).join(", "),
                    startTime: firebase.firestore.Timestamp.fromDate(new Date(this.startTime)),
                    endTime: firebase.firestore.Timestamp.fromDate(new Date(this.endTime)),
                    uid: this.$store.state.user.uid
                })
                .then((snapshot) => {
                    this.dialog = true;
                    this.$refs.form.reset();
                    this.value = [100, 400];
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