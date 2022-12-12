<template>
    <div class="box">
        <v-tabs v-model="tab" class="mb-12" color="#000" grow>
            <v-tab><h1>HOTO</h1></v-tab>
            <v-tab><h1>Voucher Redemption</h1></v-tab>
            <v-tab><h1>Games</h1></v-tab>   
        </v-tabs>

        <v-tabs-items v-model="tab">
            <!--HOTO-->
            <v-tab-item>
                <v-data-table
                    :headers="headersHOTO"
                    :items="dataHOTO"
                    item-key="serialNum"
                    class="elevation-1"
                    :search="searchHOTO"
                    multi-sort
                >
                    <template v-slot:top>
                        <v-text-field
                        v-model="searchHOTO"
                        color="#000"
                        label="Search..."
                        class="mx-4"
                        ></v-text-field>
                    </template>

                    <!--icons-->
                    <template v-slot:[`item.actions`]="{ item }">
                        <v-icon
                            small
                            class="mr-2"
                            @click="editHOTO(item)"
                        >
                            mdi-pencil
                        </v-icon>
                        <v-icon
                            small
                            @click="deleteHOTO(item)"
                        >
                            mdi-delete
                        </v-icon>
                    </template>
                </v-data-table>
                
                <!--Edit HOTO dialog (incomplete)-->
                <v-dialog
                    max-width="600"
                    v-model="dialogHOTO"
                >
                    <v-card>
                        <v-form v-model="validHOTO" ref="formHOTO">
                            <v-row class="pa-6 ma-0">
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
                                        v-model="locationHOTO"
                                        color="#000"
                                        :items="items"
                                        label="Location"
                                        :rules="locRulesHOTO"
                                        required
                                    ></v-select>
                                </v-col>
                            </v-row>
                        </v-form>

                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn
                                color="blue darken-1"
                                text
                                @click="close"
                            >
                                Cancel
                            </v-btn>
                            <v-btn
                                v-if="validHOTO"
                                color="blue darken-1"
                                text
                                @click="save"
                            >
                                Save
                            </v-btn>
                            <v-btn
                                v-else
                                color="blue darken-1"
                                text
                                disabled
                            >
                                Save
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-tab-item>


            <!--Redeem-->
            <v-tab-item>
                <v-data-table
                    :headers="headersVR"
                    :items="dataVR"
                    item-key="serialNum"
                    class="elevation-1"
                    :search="searchVR"
                    multi-sort
                >
                    <template v-slot:top>
                        <v-text-field
                        v-model="searchVR"
                        color="#000"
                        label="Search..."
                        class="mx-4"
                        ></v-text-field>
                    </template>

                    <template v-slot:[`item.actions`]="{ item }">
                        <v-icon
                            small
                            class="mr-2"
                            @click="editVR(item)"
                        >
                            mdi-pencil
                        </v-icon>
                        <v-icon
                            small
                            @click="deleteVR(item)"
                        >
                            mdi-delete
                        </v-icon>
                    </template>
                </v-data-table>
            </v-tab-item>
            
            <!--Edit VR dialog-->
            <v-dialog
                max-width="600"
                v-model="dialogVR"
            >
                <v-card>
                    <v-form v-model="validVR" ref="formVR">
                        <v-row class="pa-6 ma-0">
                            <v-col cols="12">
                                <h1 class="mb-12">Voucher Redemption</h1>
                                <v-text-field
                                    v-model="matricNoVR"
                                    color="#000"
                                    :rules="matricRules"
                                    :counter="8"
                                    label="Matriculation Number"
                                    type="number"
                                    required
                                ></v-text-field>
                                <v-text-field
                                    v-model="sNoVR"
                                    color="#000"
                                    :rules="sNoRulesVR"
                                    label="Voucher Serial Number"
                                    type="number"
                                    required
                                ></v-text-field>
                                <v-select
                                    v-model="locationVR"
                                    color="#000"
                                    :items="items"
                                    label="Location"
                                    :rules="locRules"
                                    required
                                ></v-select>
                                <v-text-field
                                    type="datetime-local"
                                    color="#000"
                                    v-model="dateVR"
                                    label="Date"
                                    :rules="dateRules"
                                ></v-text-field>
                            </v-col>
                        </v-row>
                    </v-form>

                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                            color="blue darken-1"
                            text
                            @click="dialogVR = !dialogVR"
                        >
                            Cancel
                        </v-btn>
                        <v-btn
                            v-if="validVR"
                            color="blue darken-1"
                            text
                            @click="saveVR"
                        >
                            Save
                        </v-btn>
                        <v-btn
                            v-else
                            color="blue darken-1"
                            text
                            disabled
                        >
                            Save
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>

            <!--Delete VR-->
            <v-dialog v-model="dialogDeleteVR" max-width="500px">
                <v-card>
                    <v-card-title class="text-h5">Are you sure you want to delete this item?</v-card-title>
                    <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="dialogDeleteVR = !dialogDeleteVR">Cancel</v-btn>
                    <v-btn color="blue darken-1" text @click="deleteConfirmVR">OK</v-btn>
                    <v-spacer></v-spacer>
                    </v-card-actions>
                </v-card>
            </v-dialog>


            <!--Games-->
            <v-tab-item>
                <v-data-table
                    :headers="headersGames"
                    :items="dataGames"
                    item-key="serialNum"
                    class="elevation-1"
                    :search="searchGames"
                    multi-sort
                >
                    <template v-slot:top>
                        <v-text-field
                        v-model="searchGames"
                        color="#000"
                        label="Search..."
                        class="mx-4"
                        ></v-text-field>
                    </template>

                    <template v-slot:[`item.actions`]="{ item }">
                        <v-icon
                            small
                            class="mr-2"
                            @click="editGames(item)"
                        >
                            mdi-pencil
                        </v-icon>
                        <v-icon
                            small
                            @click="deleteGames(item)"
                        >
                            mdi-delete
                        </v-icon>
                    </template>
                </v-data-table>
            </v-tab-item>
        </v-tabs-items>

        <!--Edit Games dialog-->
        <v-dialog
            max-width="600"
            v-model="dialogGames"
        >
            <v-card class="pa-6 ma-0">
                <v-form v-model="validGames" ref="formGames">
                    <v-row>
                        <v-col cols="12">
                            <h1 class="mb-12">Games Redemption</h1>
                            <v-text-field
                                v-model="sNoGames"
                                color="#000"
                                :rules="sNoRulesGames"
                                label="Voucher Serial Number"
                                type="number"
                                required
                            ></v-text-field>
                        </v-col>
                    </v-row>
                </v-form>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        color="blue darken-1"
                        text
                        @click="dialogGames = !dialogGames"
                    >
                        Cancel
                    </v-btn>
                    <v-btn
                        v-if="validGames"
                        color="blue darken-1"
                        text
                        @click="saveGames"
                    >
                        Save
                    </v-btn>
                    <v-btn
                        v-else
                        color="blue darken-1"
                        text
                        disabled
                    >
                        Save
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!--Delete Games-->
        <v-dialog v-model="dialogDeleteGames" max-width="500px">
            <v-card>
                <v-card-title class="text-h5">Are you sure you want to delete this item?</v-card-title>
                <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="dialogDeleteGames = !dialogDeleteGames">Cancel</v-btn>
                <v-btn color="blue darken-1" text @click="deleteConfirmGames">OK</v-btn>
                <v-spacer></v-spacer>
                </v-card-actions>
            </v-card>
        </v-dialog>


        <!--Universal Success Dialog-->
            <v-dialog
                max-width="600"
                v-model="success"
            >
                <v-card>
                    <v-card-text class="text-center">
                        <v-icon class="py-12" color="success" size="100" style="opacity: 0.4">mdi-check-circle-outline</v-icon>
                        <div class="text-h5">Update successful!</div>
                    </v-card-text>
                    <v-card-actions class="justify-end">
                    <v-btn
                        text
                        @click="success = !success"
                    >Close</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
    </div>
</template>
<script>
    import { db } from "../firebase/firebaseinit";
    import { doc, collection, getDocs, onSnapshot, addDoc, updateDoc, query, where, deleteDoc } from "firebase/firestore";
    import firebase from 'firebase/compat/app';
    import 'firebase/compat/auth';
    import 'firebase/compat/firestore';

    import VueSlider from 'vue-slider-component'
    import 'vue-slider-component/theme/antd.css'

    export default {
        components: {
            VueSlider,
        },
        data(){
            return {
                tab: null,
                searchHOTO: "",
                searchVR: "",
                searchGames: "",
                headersHOTO: [
                {
                    text: 'S/N',
                    align: 'start',
                    sortable: true,
                    value: 'serialNums',
                },
                { text: 'Location', value: 'location' },
                { text: 'Start Date', value: 'sDate' },
                { text: 'End Date', value: 'eDate' },
                { text: 'Email', value: 'email' },
                { text: 'Actions', value: 'actions', sortable: false }
                ],
                dataHOTO: [],
                headersVR: [
                {
                    text: 'S/N',
                    align: 'start',
                    sortable: true,
                    value: 'serialNum',
                },
                { text: 'Matriculation No.', value: 'matricNum' },
                { text: 'Location', value: 'location' },
                { text: 'Date', value: 'date' },
                { text: 'Email', value: 'email' },
                { text: 'Actions', value: 'actions', sortable: false }
                ],
                dataVR: [],
                headersGames: [
                {
                    text: 'S/N',
                    align: 'start',
                    sortable: true,
                    value: 'serialNum',
                },
                { text: 'Email', value: 'email' },
                { text: 'Actions', value: 'actions', sortable: false }
                ],
                dataGames: [],
                dialogHOTO: false,
                dialogVR: false,
                dialogGames: false,
                dialogDeleteHOTO: false,
                dialogDeleteVR: false,
                dialogDeleteGames: false,
                delHOTO: null,
                delVR: null,
                delGames: null,
                success: false,

                //HOTO
                startTime: null,
                endTime: null,
                dialog: false,
                voucherList: [],
                validHOTO: false,
                validVR: false,
                validGames: false,
                locRulesHOTO: [
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
                locationHOTO: null,
                value: [],
                options: {
                    min: 0,
                    max: 6020,
                    process: pos => Array.from({length:pos.length/2}, (_,i)=>[pos[2*i], pos[2*i+1]]),
                    enableCross: true
                },

                //VR
                matricList: [],
                matricNoVR: '',
                sNoVR: '',
                dateVR: null,
                matricRules: [
                    m => !!m || 'Field is required',
                    m => m.length == 8 || 'Matriculation number must be 8 digits long',
                    m => (this.matricList.includes(m) == false || m == this.currVR[0]) || 'Matriculation number is already in database',
                ],
                sNoRulesVR: [
                    s => !!s || 'Field is required',
                    s => (this.voucherList.includes(s) || s == this.currVR[1]) || 'Voucher does not exist/is unavailable',
                ],
                locRules: [
                    s => !!s || 'Field is required',
                ],
                locationVR: null,
                currVR: ["", ""],

                //Games
                sNoGames: "",
                sNoRulesGames: [
                    s => !!s || 'Field is required',
                    s => (this.voucherList.includes(s) || s == this.currGames[0]) || 'Voucher does not exist/is unavailable',
                ],
                currGames: [],
            }
        },
        created() {
            //HOTO
            const hRef = collection(db, 'hotoDB');
            onSnapshot(hRef, (querySnapshot) => {
            this.dataHOTO = [];
            querySnapshot.docs.forEach((doc) => {
                this.dataHOTO.push({ ...doc.data(), id: doc.id })
                
                var sD = new Date(doc.data().startTime.seconds*1000);
                sD = [String(sD.getDate()).padStart(2, '0'), String(sD.getMonth()+1).padStart(2, '0'), String(sD.getFullYear())].join("/") + " " + [String(sD.getHours()).padStart(2, '0'), String(sD.getMinutes()).padStart(2, '0')].join(":");
                this.dataHOTO[this.dataHOTO.length-1]["sDate"] = sD;

                var eD = new Date(doc.data().endTime.seconds*1000);
                eD = [String(eD.getDate()).padStart(2, '0'), String(eD.getMonth()+1).padStart(2, '0'), String(eD.getFullYear())].join("/") + " " + [String(eD.getHours()).padStart(2, '0'), String(eD.getMinutes()).padStart(2, '0')].join(":");
                this.dataHOTO[this.dataHOTO.length-1]["eDate"] = eD;
            })
            console.log(this.dataHOTO)
            });

            //VR
            const vrRef = collection(db, 'voucherRedemption');
            onSnapshot(vrRef, (querySnapshot) => {
            this.dataVR = [];
            querySnapshot.docs.forEach((doc) => {
                this.dataVR.push({ ...doc.data(), id: doc.id })
                
                var d = new Date(doc.data().timestamp.seconds*1000);
                d = [String(d.getDate()).padStart(2, '0'), String(d.getMonth()+1).padStart(2, '0'), String(d.getFullYear())].join("/") + " " + [String(d.getHours()).padStart(2, '0'), String(d.getMinutes()).padStart(2, '0')].join(":");
                this.dataVR[this.dataVR.length-1]["date"] = d;
            })
            console.log(this.dataVR)
            });

            //Games
            const gRef = collection(db, 'vouchers');
            onSnapshot(gRef, (querySnapshot) => {
            this.dataGames = [];
            querySnapshot.docs.forEach((doc) => {
                if (doc.data().distributionMethod == "Games Redemption") {
                    this.dataGames.push({ ...doc.data(), id: doc.id })
                }
            })
            console.log(this.dataGames)
            });

            //HOTO & VR & Games Edit
            const vRef = collection(db, 'vouchers');
            onSnapshot(vRef, (querySnapshot) => {
            var v = [];
            querySnapshot.docs.forEach((doc) => {
                if (doc.data().isAvailable) {
                    v.push(doc.data().serialNum);
                }
            })
            this.voucherList = v;
            this.$refs.formVR.validate();
            this.$refs.formGames.validate()
            });

            //VR Edit
            const mRef = collection(db, 'voucherRedemption');
            onSnapshot(mRef, (querySnapshot) => {
            var m = [];
            querySnapshot.docs.forEach((doc) => {
                m.push(doc.data().matricNum);
            })
            this.matricList = m;
            this.$refs.formVR.validate();
            });
        },
        methods: {
            //HOTO
            editHOTO(item) {
                this.value = (item.serialNums.split(', ').join('-').split('-')).map(function(item) {return parseInt(item, 10)});
                
                var sD = new Date(item.startTime.seconds*1000);
                sD = [String(sD.getFullYear()), String(sD.getMonth()+1).padStart(2, '0'), String(sD.getDate()).padStart(2, '0')].join("-") + "T" + [String(sD.getHours()).padStart(2, '0'), String(sD.getMinutes()).padStart(2, '0')].join(":");
                this.startTime = sD;

                var eD = new Date(item.endTime.seconds*1000);
                eD = [String(eD.getFullYear()), String(eD.getMonth()+1).padStart(2, '0'), String(eD.getDate()).padStart(2, '0')].join("-") + "T" + [String(eD.getHours()).padStart(2, '0'), String(eD.getMinutes()).padStart(2, '0')].join(":");
                this.endTime = eD;

                this.locationHOTO = item.location

                this.dialogHOTO = true;
            },
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
            submitHOTO() {

            },
            save() {

            },
            close() {

            },
            deleteHOTO() {

            },

            //VR
            editVR(item) {
                this.matricNoVR = item.matricNum;
                this.sNoVR = item.serialNum;
                this.currVR = [item.matricNum, item.serialNum, item.email];
                this.locationVR = item.location;

                var d = new Date(item.timestamp.seconds*1000);
                d = [String(d.getFullYear()), String(d.getMonth()+1).padStart(2, '0'), String(d.getDate()).padStart(2, '0')].join("-") + "T" + [String(d.getHours()).padStart(2, '0'), String(d.getMinutes()).padStart(2, '0')].join(":");
                this.dateVR = d;

                this.dialogVR = true;
            },
            saveVR() {
                getDocs(query(collection(db, 'voucherRedemption'), where("serialNum", "==", this.currVR[1])))
                .then((snapshot) => {
                    var v = "";
                    snapshot.docs.forEach((doc) => {
                        v = doc.id;
                    })
                    const vRef = doc(db, "voucherRedemption", v);
                    updateDoc(vRef, {
                        location: this.locationVR,
                        matricNum: this.matricNoVR,
                        serialNum: this.sNoVR,
                        timestamp: firebase.firestore.Timestamp.fromDate(new Date(this.dateVR)),
                    })
                    .then((snapshot) => {
                        if (this.sNoVR != this.currVR[1]) {
                            getDocs(query(collection(db, 'vouchers'), where("serialNum", "==", this.sNoVR)))
                            .then((snapshot) => {
                                var v = "";
                                snapshot.docs.forEach((doc) => {
                                    v = doc.id;
                                })
                                const vRef = doc(db, "vouchers", v);
                                updateDoc(vRef, {
                                    isAvailable: false,
                                    distributionMethod: "Voucher Redemption",
                                    email: this.currVR[2]
                                })
                                .then((snapshot) => {

                                })
                                .catch(err => {
                                    console.log(err);
                                })
                            })
                            .catch(err => {
                                console.log(err);
                            })

                            getDocs(query(collection(db, 'vouchers'), where("serialNum", "==", this.currVR[1])))
                            .then((snapshot) => {
                                var v = "";
                                snapshot.docs.forEach((doc) => {
                                    v = doc.id;
                                })
                                const vRef = doc(db, "vouchers", v);
                                updateDoc(vRef, {
                                    isAvailable: true,
                                    email: "",
                                    distributionMethod: "",
                                })
                                .then((snapshot) => {
                                    this.dialogVR = false;
                                    this.success = true;
                                })
                                .catch(err => {
                                    console.log(err);
                                })
                            })
                            .catch(err => {
                                console.log(err);
                            })
                        } else {
                            this.dialogVR = false;
                            this.success = true;
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    })
                })
                .catch(err => {
                    console.log(err);
                })
            },
            deleteVR(item) {
                this.dialogDeleteVR = true;
                this.delVR = item;
            },
            deleteConfirmVR() {
                getDocs(query(collection(db, 'voucherRedemption'), where("serialNum", "==", this.delVR.serialNum)))
                .then((snapshot) => {
                    var v = "";
                    snapshot.docs.forEach((doc) => {
                        v = doc.id;
                    })

                    deleteDoc(doc(db, 'voucherRedemption', v), {
                    })
                    .then((snapshot) => {
                        getDocs(query(collection(db, 'vouchers'), where("serialNum", "==", this.delVR.serialNum)))
                        .then((snapshot) => {
                            var r = "";
                            snapshot.docs.forEach((doc) => {
                                r = doc.id;
                            })
                            const vRef = doc(db, "vouchers", r);
                            updateDoc(vRef, {
                                isAvailable: true,
                                email: "",
                                distributionMethod: "",
                            })
                            .then((snapshot) => {
                                this.dialogDeleteVR = false;
                                this.success = true;
                            })
                            .catch(err => {
                                console.log(err);
                            })
                        })
                        .catch(err => {
                            console.log(err);
                        })
                    })
                    .catch(err => {
                        console.log(err);
                    })
                })
                .catch(err => {
                    console.log(err);
                })
            },

            //Games
            editGames(items) {
                this.currGames = [items.serialNum, items.email];
                this.sNoGames = items.serialNum;

                this.dialogGames = true;
            },
            saveGames() {
                if (this.sNoGames != this.currGames[0]) {
                    getDocs(query(collection(db, 'vouchers'), where("serialNum", "==", this.sNoGames)))
                    .then((snapshot) => {
                        var v = "";
                        snapshot.docs.forEach((doc) => {
                            v = doc.id;
                        })
                        const vRef = doc(db, "vouchers", v);
                        updateDoc(vRef, {
                            isAvailable: false,
                            distributionMethod: "Games Redemption",
                            email: this.currGames[1]
                        })
                        .then((snapshot) => {

                        })
                        .catch(err => {
                            console.log(err);
                        })
                    })
                    .catch(err => {
                        console.log(err);
                    })

                    getDocs(query(collection(db, 'vouchers'), where("serialNum", "==", this.currGames[0])))
                    .then((snapshot) => {
                        var v = "";
                        snapshot.docs.forEach((doc) => {
                            v = doc.id;
                        })
                        const vRef = doc(db, "vouchers", v);
                        updateDoc(vRef, {
                            isAvailable: true,
                            email: "",
                            distributionMethod: "",
                        })
                        .then((snapshot) => {
                            this.dialogGames = false;
                            this.success = true;
                        })
                        .catch(err => {
                            console.log(err);
                        })
                    })
                    .catch(err => {
                        console.log(err);
                    })
                } else {
                    this.dialogGames = false;
                    this.success = true;
                }
            },
            deleteGames(items) {
                this.dialogDeleteGames = true;
                this.delGames = items;
            },
            deleteConfirmGames() {
                getDocs(query(collection(db, 'vouchers'), where("serialNum", "==", this.delGames.serialNum)))
                    .then((snapshot) => {
                        var v = "";
                        snapshot.docs.forEach((doc) => {
                            v = doc.id;
                        })
                        const vRef = doc(db, "vouchers", v);
                        updateDoc(vRef, {
                            isAvailable: true,
                            email: "",
                            distributionMethod: "",
                        })
                        .then((snapshot) => {
                            this.dialogDeleteGames = false;
                            this.success = true;
                        })
                        .catch(err => {
                            console.log(err);
                        })
                    })
                    .catch(err => {
                        console.log(err);
                    })
            },
        }
    };
</script>

<style lang="css" scoped>
    .box {
        width: 80%;
        margin: 5% auto 5% auto;
    }
</style>