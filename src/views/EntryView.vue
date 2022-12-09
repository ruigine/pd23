<template>
    <div class="box">
        <v-tabs v-model="tab" class="mb-12" color="#000">
            <v-tab><h1>HOTO</h1></v-tab>
            <v-tab><h1>Redeem</h1></v-tab>
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
                
                <!--Edit HOTO dialog-->
                <v-dialog
                    max-width="600"
                    v-model="dialogHOTO"
                >
                    <v-card>
                        <v-form v-model="validHOTO" ref="form">
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
                                        v-model="location"
                                        color="#000"
                                        :items="items"
                                        label="Location"
                                        :rules="locRules"
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
                            @click="editItem(item)"
                        >
                            mdi-pencil
                        </v-icon>
                        <v-icon
                            small
                            @click="deleteItem(item)"
                        >
                            mdi-delete
                        </v-icon>
                    </template>
                </v-data-table>
            </v-tab-item>
            
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
                            @click="editItem(item)"
                        >
                            mdi-pencil
                        </v-icon>
                        <v-icon
                            small
                            @click="deleteItem(item)"
                        >
                            mdi-delete
                        </v-icon>
                    </template>
                </v-data-table>
            </v-tab-item>
        </v-tabs-items>
    </div>
</template>
<script>
    import { db } from "../firebase/firebaseinit";
    import { doc, collection, getDocs, onSnapshot, addDoc, updateDoc, query, where } from "firebase/firestore";
    
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
                { text: 'UID', value: 'uid' },
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
                { text: 'UID', value: 'uid' },
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
                { text: 'UID', value: 'uid' },
                { text: 'Actions', value: 'actions', sortable: false }
                ],
                dataGames: [],
                dialogHOTO: false,
                dialogVR: false,
                dialogGames: false,
                dialogDeleteHOTO: false,
                dialogDeleteVR: false,
                dialogDeleteGames: false,

                //HOTO
                startTime: null,
                endTime: null,
                dialog: false,
                voucherList: [],
                validHOTO: false,
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
                value: [],
                options: {
                    min: 0,
                    max: 6020,
                    process: pos => Array.from({length:pos.length/2}, (_,i)=>[pos[2*i], pos[2*i+1]]),
                    enableCross: true
                }
            }
        },
        created() {
            //HOTO
            const hRef = collection(db, 'hotoDB');
            onSnapshot(hRef, (querySnapshot) => {
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
            querySnapshot.docs.forEach((doc) => {
                if (doc.data().distributionMethod == "games") {
                    this.dataGames.push({ ...doc.data(), id: doc.id })
                }
            })
            console.log(this.dataGames)
            });

            //HOTO Edit
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
            //HOTO
            editHOTO(item) {
                this.value = (item.serialNums.split(', ').join('-').split('-')).map(function(item) {return parseInt(item, 10)});
                
                var sD = new Date(item.startTime.seconds*1000);
                sD = [String(sD.getFullYear()), String(sD.getMonth()+1).padStart(2, '0'), String(sD.getDate()).padStart(2, '0')].join("-") + "T" + [String(sD.getHours()).padStart(2, '0'), String(sD.getMinutes()).padStart(2, '0')].join(":");
                this.startTime = sD;

                var eD = new Date(item.endTime.seconds*1000);
                eD = [String(eD.getFullYear()), String(eD.getMonth()+1).padStart(2, '0'), String(eD.getDate()).padStart(2, '0')].join("-") + "T" + [String(eD.getHours()).padStart(2, '0'), String(eD.getMinutes()).padStart(2, '0')].join(":");
                this.endTime = eD;

                this.location = item.location

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
            deleteItem() {

            }
        }
    };
</script>

<style lang="css" scoped>
    .box {
        width: 80%;
        margin: 5% auto 5% auto;
    }
</style>