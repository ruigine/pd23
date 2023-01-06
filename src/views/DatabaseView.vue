<template>
    <div class="box">
        <v-tabs v-model="tab" class="mb-12" color="#000" grow>
            <v-tab><h1>HOTO</h1></v-tab>
            <v-tab><h1>Voucher Redemption</h1></v-tab>
            <v-tab><h1>Prize Redemption</h1></v-tab>   
            <v-tab><h1>Roadshow Giveaway</h1></v-tab>
        </v-tabs>

        <v-tabs-items v-model="tab" class="px-1">
            <!--HOTO-->
            <v-tab-item>
                <v-data-table
                    :headers="headersHOTO"
                    :items="dataHOTO"
                    class="elevation-1"
                    :search="searchHOTO"
                    @click:row="history"
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
                            class="mr-2 outlined"
                            @click="editHOTO(item)"
                            color="primary"
                        >
                            mdi-pencil
                        </v-icon>
                        <v-icon
                            small
                            class="outlined"
                            @click="deleteHOTO(item)"
                            color="red"
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
                    <v-card class="pa-6 ma-0">
                        <v-form v-model="validHOTO" ref="formHOTO">
                            <v-row class="pa-6 ma-0">
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
                                        v-model="locationHOTO"
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
                                @click="dialogHOTO = !dialogHOTO"
                            >
                                Cancel
                            </v-btn>
                            <v-btn
                                v-if="validHOTO"
                                color="blue darken-1"
                                text
                                @click="saveHOTO"
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

                <v-btn class="mt-12 mb-6" @click="expand" color="#fff">Deleted HOTO entries</v-btn>
                <v-expansion-panels flat class="mb-1" v-model="expandHOTO">
                    <v-expansion-panel>
                        <v-expansion-panel-content>
                            <v-data-table
                                :headers="headersDelHOTO"
                                :items="dataDelHOTO"
                                class="elevation-1"
                                :search="searchDelHOTO"
                                multi-sort
                            >
                                <template v-slot:top>
                                    <v-text-field
                                    v-model="searchDelHOTO"
                                    color="#000"
                                    label="Search..."
                                    class="mx-4"
                                    ></v-text-field>
                                </template>

                                <template slot="no-data">
                                    No delete history.
                                </template>
                            </v-data-table>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>
            </v-tab-item>

            <!--Delete HOTO-->
            <v-dialog v-model="dialogDeleteHOTO" max-width="500px">
                <v-card>
                    <v-card-title class="text-h5">Are you sure you want to delete this item?</v-card-title>
                    <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="dialogDeleteHOTO = !dialogDeleteHOTO">Cancel</v-btn>
                    <v-btn color="blue darken-1" text @click="deleteConfirmHOTO">OK</v-btn>
                    <v-spacer></v-spacer>
                    </v-card-actions>
                </v-card>
            </v-dialog>


            <!--Redeem-->
            <v-tab-item>
                <v-data-table
                    :headers="headersVR"
                    :items="dataVR"
                    class="elevation-1"
                    :search="searchVR"
                    @click:row="history"
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
                            class="mr-2 outlined"
                            @click="editVR(item)"
                            color="primary"
                        >
                            mdi-pencil
                        </v-icon>
                        <v-icon
                            small
                            @click="deleteVR(item)"
                            class="outlined"
                            color="red"
                        >
                            mdi-delete
                        </v-icon>
                    </template>
                </v-data-table>

                <v-btn class="mt-12 mb-6" @click="expand" color="#fff">Deleted voucher redemption entries</v-btn>
                <v-expansion-panels flat class="mb-1" v-model="expandVR">
                    <v-expansion-panel>
                        <v-expansion-panel-content>
                            <v-data-table
                                :headers="headersDelVR"
                                :items="dataDelVR"
                                class="elevation-1"
                                :search="searchDelVR"
                                multi-sort
                            >
                                <template v-slot:top>
                                    <v-text-field
                                    v-model="searchDelVR"
                                    color="#000"
                                    label="Search..."
                                    class="mx-4"
                                    ></v-text-field>
                                </template>

                                <template slot="no-data">
                                    No delete history.
                                </template>
                            </v-data-table>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>
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
                                    :rules="matricRulesVR"
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
                    class="elevation-1"
                    :search="searchGames"
                    @click:row="history"
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
                            class="mr-2 outlined"
                            @click="editGames(item)"
                            color="primary"
                        >
                            mdi-pencil
                        </v-icon>
                        <v-icon
                            small
                            @click="deleteGames(item)"
                            class="outlined"
                            color="red"
                        >
                            mdi-delete
                        </v-icon>
                    </template>
                </v-data-table>

                <v-btn class="mt-12 mb-6" @click="expand" color="#fff">Deleted prize redemption entries</v-btn>
                <v-expansion-panels flat class="mb-1" v-model="expandGames">
                    <v-expansion-panel>
                        <v-expansion-panel-content>
                            <v-data-table
                                :headers="headersDelGames"
                                :items="dataDelGames"
                                class="elevation-1"
                                :search="searchDelGames"
                                multi-sort
                            >
                                <template v-slot:top>
                                    <v-text-field
                                    v-model="searchDelGames"
                                    color="#000"
                                    label="Search..."
                                    class="mx-4"
                                    ></v-text-field>
                                </template>

                                <template slot="no-data">
                                    No delete history.
                                </template>
                            </v-data-table>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>
            </v-tab-item>

        <!--Edit Games dialog-->
        <v-dialog
            max-width="600"
            v-model="dialogGames"
        >
            <v-card class="pa-6 ma-0">
                <v-form v-model="validGames" ref="formGames">
                    <v-row class="pa-6 ma-0">
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
                                v-model="matricNoGames"
                                color="#000"
                                :rules="matricRulesGames"
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
                                v-model="sNoGames"
                                no-data-text="Invalid voucher S/N"
                                :items="sNosGames"
                                :rules="sNoRulesGames"
                                color="#000"
                                label="Voucher Serial Number"
                                chips
                                multiple
                                required
                            ></v-autocomplete>
                            <v-select
                                v-model="locationGames"
                                color="#000"
                                :items="items"
                                label="Location"
                                :rules="locRules"
                                required
                            ></v-select>
                            <v-text-field
                                type="datetime-local"
                                color="#000"
                                v-model="dateGames"
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


        <!--LD-->
            <v-tab-item>
                <v-data-table
                    :headers="headersLD"
                    :items="dataLD"
                    class="elevation-1"
                    :search="searchLD"
                    @click:row="history"
                    multi-sort
                >
                    <template v-slot:top>
                        <v-text-field
                        v-model="searchLD"
                        color="#000"
                        label="Search..."
                        class="mx-4"
                        ></v-text-field>
                    </template>

                    <template v-slot:[`item.actions`]="{ item }">
                        <v-icon
                            small
                            class="mr-2 outlined"
                            @click="editLD(item)"
                            color="primary"
                        >
                            mdi-pencil
                        </v-icon>
                        <v-icon
                            small
                            @click="deleteLD(item)"
                            class="outlined"
                            color="red"
                        >
                            mdi-delete
                        </v-icon>
                    </template>
                </v-data-table>

                <v-btn class="mt-12 mb-6" @click="expand" color="#fff">Deleted Lucky Draw entries</v-btn>
                <v-expansion-panels flat class="mb-1" v-model="expandLD">
                    <v-expansion-panel>
                        <v-expansion-panel-content>
                            <v-data-table
                                :headers="headersDelLD"
                                :items="dataDelLD"
                                class="elevation-1"
                                :search="searchDelLD"
                                multi-sort
                            >
                                <template v-slot:top>
                                    <v-text-field
                                    v-model="searchDelLD"
                                    color="#000"
                                    label="Search..."
                                    class="mx-4"
                                    ></v-text-field>
                                </template>

                                <template slot="no-data">
                                    No delete history.
                                </template>
                            </v-data-table>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>
            </v-tab-item>
            
            <!--Edit LD dialog-->
            <v-dialog
                max-width="600"
                v-model="dialogLD"
            >
                <v-card>
                    <v-form v-model="validLD" ref="formLD">
                        <v-row class="pa-6 ma-0">
                            <v-col cols="12">
                                <h1 class="mb-12">Lucky Draw</h1>
                                <v-text-field
                                    v-model="nameLD"
                                    color="#000"
                                    :rules="nameRulesLD"
                                    label="Name"
                                    type="text"
                                    required
                                ></v-text-field>
                                <v-text-field
                                    v-model="matricNoLD"
                                    color="#000"
                                    :rules="matricRulesLD"
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
                                 <v-text-field
                                    type="datetime-local"
                                    color="#000"
                                    v-model="dateLD"
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
                            @click="dialogLD = !dialogLD"
                        >
                            Cancel
                        </v-btn>
                        <v-btn
                            v-if="validLD"
                            color="blue darken-1"
                            text
                            @click="saveLD"
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

            <!--Delete LD-->
            <v-dialog v-model="dialogDeleteLD" max-width="500px">
                <v-card>
                    <v-card-title class="text-h5">Are you sure you want to delete this item?</v-card-title>
                    <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="dialogDeleteLD = !dialogDeleteLD">Cancel</v-btn>
                    <v-btn color="blue darken-1" text @click="deleteConfirmLD">OK</v-btn>
                    <v-spacer></v-spacer>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-tabs-items>


        <!--Universal Success Dialog-->
        <v-dialog
            max-width="600"
            v-model="success"
        >
            <v-card>
                <v-card-text class="text-center" v-if="successList.length == 0">
                    <v-icon class="py-12" color="success" size="100" style="opacity: 0.4">mdi-check-circle-outline</v-icon>
                    <div class="text-h5">Update successful!</div>
                </v-card-text>

                <template v-else>
                    <div class="pt-8 pb-6 text-h5 text-center">
                    <v-icon color="success" size="40" style="opacity: 0.4">mdi-check-circle-outline</v-icon> Update successful!
                    </div>

                    <v-list-item class="px-8" two-line v-for="(item, idx) in successList" :key="idx">
                        <v-list-item-content>
                            <v-list-item-title>{{item.name}}</v-list-item-title>
                            <v-list-item-subtitle>{{item.value}}</v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>
                </template>
                
                <v-card-actions class="justify-end">
                <v-btn
                    text
                    @click="success = !success"
                >Close</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>


        <!--Edit history dialog-->
        <v-dialog
            max-width="80%"
            v-model="dialogEdit"
        >
            <v-card class="pa-6 ma-0">
                <v-row class="pa-6 ma-0">
                    <v-col cols="12">
                        <h1 class="mb-12">Past Edits</h1>
                        <v-data-table
                            :headers="headersEdit"
                            :items="dataEdit"
                            class="elevation-1"
                            :search="searchEdit"
                            multi-sort
                        >
                            <template v-slot:top>
                                <v-text-field
                                v-model="searchEdit"
                                color="#000"
                                label="Search..."
                                class="mx-4"
                                ></v-text-field>
                            </template>

                            <template slot="no-data">
                                No history of edits.
                            </template>
                        </v-data-table>
                    </v-col>
                </v-row>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
    import { db } from "../firebase/firebaseinit";
    import { doc, collection, getDocs, onSnapshot, addDoc, updateDoc, query, where, orderBy, deleteDoc } from "firebase/firestore";
    import firebase from 'firebase/compat/app';
    import 'firebase/compat/auth';
    import 'firebase/compat/firestore';

    export default {
        data(){
            return {
                tab: null,
                successList: [],
                //Del
                expandHOTO: null,
                expandLD: null,
                expandVR: null,
                expandGames: null,
                headersDelHOTO: [
                {
                    text: 'S/Ns (Start)',
                    align: 'start',
                    sortable: true,
                    value: 'serialNumStart',
                },
                { text: 'S/Ns (End)', value: 'serialNumEnd' },
                { text: 'Location', value: 'location' },
                { text: 'Start Date', value: 'sDate' },
                { text: 'End Date', value: 'eDate' },
                { text: 'Email', value: 'email' },
                { text: 'Deleted Date', value: 'deleteDate' }
                ],
                dataDelHOTO: null,
                headersDelLD: [
                {
                    text: 'Name',
                    align: 'start',
                    sortable: true,
                    value: 'name',
                },
                { text: 'Matriculation No.', value: 'matricNum' },
                { text: 'Telephone', value: 'telephone' },
                { text: 'Date', value: 'datestamp' },
                { text: 'Email', value: 'email' },
                { text: 'Deleted Date', value: 'deleteDate' }
                ],
                dataDelLD: null,
                headersDelVR: [
                {
                    text: 'S/N',
                    align: 'start',
                    sortable: true,
                    value: 'serialNum',
                },
                { text: 'Matriculation No.', value: 'matricNum' },
                { text: 'Location', value: 'location' },
                { text: 'Date', value: 'datestamp' },
                { text: 'Email', value: 'email' },
                { text: 'Deleted Date', value: 'deleteDate' }
                ],
                dataDelVR: null,
                headersDelGames: [
                {
                    text: 'Name',
                    align: 'start',
                    sortable: true,
                    value: 'name',
                },
                { text: 'Matriculation No.', value: 'matricNum' },
                { text: 'Prize', value: 'prize' },
                { text: 'S/N', value: 'serialNum' },
                { text: 'Location', value: 'location' },
                { text: 'Date', value: 'datestamp' },
                { text: 'Email', value: 'email' },
                { text: 'Deleted Date', value: 'deleteDate' }                ],
                dataDelGames: null,
                searchDelHOTO: "",
                searchDelLD: "",
                searchDelVR: "",
                searchDelGames: "",
                //Others
                searchHOTO: "",
                searchLD: "",
                searchVR: "",
                searchGames: "",
                searchEdit: "",
                headersEdit: [],
                dataEdit: [],
                headersHOTO: [
                {
                    text: 'S/Ns (Start)',
                    align: 'start',
                    sortable: true,
                    value: 'serialNumStart',
                },
                { text: 'S/Ns (End)', value: 'serialNumEnd' },
                { text: 'Location', value: 'location' },
                { text: 'Start Date', value: 'sDate' },
                { text: 'End Date', value: 'eDate' },
                { text: 'Email', value: 'email' },
                { text: 'Actions', value: 'actions', sortable: false, width: '80px' }
                ],
                dataHOTO: [],
                headersLD: [
                {
                    text: 'Name',
                    align: 'start',
                    sortable: true,
                    value: 'name',
                },
                { text: 'Matriculation No.', value: 'matricNum' },
                { text: 'Telephone', value: 'telephone' },
                { text: 'Date', value: 'datestamp' },
                { text: 'Email', value: 'email' },
                { text: 'Actions', value: 'actions', sortable: false, width: '80px' }
                ],
                headersVR: [
                {
                    text: 'S/N',
                    align: 'start',
                    sortable: true,
                    value: 'serialNum',
                },
                { text: 'Matriculation No.', value: 'matricNum' },
                { text: 'Location', value: 'location' },
                { text: 'Date', value: 'datestamp' },
                { text: 'Email', value: 'email' },
                { text: 'Actions', value: 'actions', sortable: false, width: '80px' }
                ],
                headersGames: [
                {
                    text: 'Name',
                    align: 'start',
                    sortable: true,
                    value: 'name',
                },
                { text: 'Matriculation No.', value: 'matricNum' },
                { text: 'Prize', value: 'prizes' },
                { text: 'S/N', value: 'sNos' },
                { text: 'Location', value: 'location' },
                { text: 'Date', value: 'datestamp' },
                { text: 'Email', value: 'email' },
                { text: 'Actions', value: 'actions', sortable: false, width: '80px' }
                ],
                dataVR: [],
                dataGames: [],
                dataLD: [],
                dialogEdit: false,
                dialogHOTO: false,
                dialogLD: false,
                dialogVR: false,
                dialogGames: false,
                dialogDeleteHOTO: false,
                dialogDeleteLD: false,
                dialogDeleteVR: false,
                dialogDeleteGames: false,
                delHOTO: null,
                delLD: null,
                delVR: null,
                delGames: null,
                success: false,
                validHOTO: false,
                validLD: false,
                validVR: false,
                validGames: false,

                //HOTO
                startTime: null,
                endTime: null,
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
                    e => (e && this.dateOrder()) || 'End date must be after start date',
                ],
                items: ['Koufu', 'SOB', 'Connexion'],
                locationHOTO: null,
                currHOTO: null,

                //LD
                matricNoLD: '',
                tele: '',
                nameLD: '',
                dateLD: null,
                nameRulesLD: [
                    n => !!n || 'Field is required',
                ],
                matricRulesLD: [
                    m => (!m || (!!m && m.length == 8)) || 'Matriculation number must be 8 digits long'
                ],
                teleRules: [
                    s => !!s || 'Field is required',
                    s=> (!s || (!!s && s.length == 8)) || 'Invalid telephone number'
                ],
                currLD: null,

                //VR
                voucherListVR: [],
                matricListVR: [],
                matricNoVR: '',
                sNoVR: '',
                dateVR: null,
                matricRulesVR: [
                    m => !!m || 'Field is required',
                    m => m.length == 8 || 'Matriculation number must be 8 digits long',
                    m => (this.matricListVR.includes(m) == false || m == this.currVR.matricNum) || 'Matriculation number is already in database',
                ],
                sNoRulesVR: [
                    s => !!s || 'Field is required',
                    s => (2421 <= Number(s) && Number(s) <= 5880) || 'Invalid voucher S/N',
                    s => (this.voucherListVR.includes(s) == false || s == this.currVR.serialNum) || 'Voucher has already been redeemed',
                ],
                locRules: [
                    s => !!s || 'Field is required',
                ],
                locationVR: null,
                currVR: null,

                //Games
                voucherListGames: [],
                matricNoGames: '',
                sNoGames: "",
                sNosGames: [],
                dateGames: null,
                locationGames: null,
                sNoRulesGames: [
                    s => !!s || 'Field is required',
                ],
                matricRulesGames: [
                    m => (!m || m.length == 8) || 'Matriculation number must be 8 digits long'
                ],
                currGames: null,
                saved: false,
                name: '',
                nameRules: [
                    n => !!n || 'Field is required',
                ],
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
            }
        },
        created() {
            //HOTO
            const hRef = collection(db, 'hoto');
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
            const vRef = query(collection(db, 'vouchers'), orderBy('date', 'desc'));
            onSnapshot(vRef, (querySnapshot) => {
            this.dataVR = []; var v = []; var m = [];
            querySnapshot.docs.forEach((doc) => {
                this.dataVR.push({ ...doc.data(), id: doc.id })
                
                var d = new Date(doc.data().date.seconds*1000);
                d = [String(d.getDate()).padStart(2, '0'), String(d.getMonth()+1).padStart(2, '0'), String(d.getFullYear())].join("/") + " " + [String(d.getHours()).padStart(2, '0'), String(d.getMinutes()).padStart(2, '0')].join(":");
                this.dataVR[this.dataVR.length-1]["datestamp"] = d;

                v.push(doc.data().serialNum);
                m.push(doc.data().matricNum);
            })
            console.log(this.dataVR);
            this.voucherListVR = v;
            console.log(this.voucherListVR);

            this.matricListVR = m;
            console.log(this.matricListVR);
            if (this.matricNoVR && this.sNoVR && this.locationVR && !this.saved) {
                this.$refs.formVR.validate();
            } else {
                this.saved = false;
            }
            });

            //Prize
            const gRef = query(collection(db, 'prize'), orderBy('date', 'desc'));
            onSnapshot(gRef, (querySnapshot) => {
            this.dataGames = []; var s = [];
            querySnapshot.docs.forEach((doc) => {
                this.dataGames.push({ ...doc.data(), id: doc.id })

                var d = new Date(doc.data().date.seconds*1000);
                d = [String(d.getDate()).padStart(2, '0'), String(d.getMonth()+1).padStart(2, '0'), String(d.getFullYear())].join("/") + " " + [String(d.getHours()).padStart(2, '0'), String(d.getMinutes()).padStart(2, '0')].join(":");
                this.dataGames[this.dataGames.length-1]["datestamp"] = d;

                if (doc.data().serialNum) {
                    s = s.concat(doc.data().serialNum);
                    this.dataGames[this.dataGames.length-1]["sNos"] = (doc.data().serialNum).join(", ");
                }

                this.dataGames[this.dataGames.length-1]["prizes"] = (doc.data().prize).join(", ");
            })
            console.log(this.dataGames);
            this.voucherListGames = s;
            console.log(this.voucherListGames);
            if (this.dialogGames && this.prize.includes('PD23 voucher')) {
                this.sNosGames = (Array.from(Array(2581).keys()).slice(1901)).filter( ( sn ) => !this.voucherListGames.includes( sn ) || this.currGames.serialNum.includes( sn ))
            }

            if (this.matricNoGames && this.sNoGames && this.locationGames && !this.saved) {
                this.$refs.formGames.validate()
            } else {
                this.saved = false;
            }
            });

            //LD
            const lRef = query(collection(db, 'roadshow'), orderBy('date', 'desc'));
            onSnapshot(lRef, (querySnapshot) => {
            this.dataLD = [];
            querySnapshot.docs.forEach((doc) => {
                this.dataLD.push({ ...doc.data(), id: doc.id })
                
                var d = new Date(doc.data().date.seconds*1000);
                d = [String(d.getDate()).padStart(2, '0'), String(d.getMonth()+1).padStart(2, '0'), String(d.getFullYear())].join("/") + " " + [String(d.getHours()).padStart(2, '0'), String(d.getMinutes()).padStart(2, '0')].join(":");
                this.dataLD[this.dataLD.length-1]["datestamp"] = d;
            })
            console.log(this.dataLD);
            });
        },
        watch: {
            tab() {
                this.expandHOTO = null;
                this.expandLD = null;
                this.expandVR = null;
                this.expandGames = null;
            }
        },
        methods: {
            //Del
            expand() {
                if (this.tab == 0) {
                    if (!this.dataDelHOTO) {
                        const hRef = collection(db, 'deletedHOTO');
                        onSnapshot(hRef, (querySnapshot) => {
                        this.dataDelHOTO = [];
                        querySnapshot.docs.forEach((doc) => {
                            this.dataDelHOTO.push({ ...doc.data(), id: doc.id })
                            
                            var sD = new Date(doc.data().startTime.seconds*1000);
                            sD = [String(sD.getDate()).padStart(2, '0'), String(sD.getMonth()+1).padStart(2, '0'), String(sD.getFullYear())].join("/") + " " + [String(sD.getHours()).padStart(2, '0'), String(sD.getMinutes()).padStart(2, '0')].join(":");
                            this.dataDelHOTO[this.dataDelHOTO.length-1]["sDate"] = sD;

                            var eD = new Date(doc.data().endTime.seconds*1000);
                            eD = [String(eD.getDate()).padStart(2, '0'), String(eD.getMonth()+1).padStart(2, '0'), String(eD.getFullYear())].join("/") + " " + [String(eD.getHours()).padStart(2, '0'), String(eD.getMinutes()).padStart(2, '0')].join(":");
                            this.dataDelHOTO[this.dataDelHOTO.length-1]["eDate"] = eD;

                            var dD = new Date(doc.data().deleteDate.seconds*1000);
                            dD = [String(dD.getDate()).padStart(2, '0'), String(dD.getMonth()+1).padStart(2, '0'), String(dD.getFullYear())].join("/") + " " + [String(dD.getHours()).padStart(2, '0'), String(dD.getMinutes()).padStart(2, '0')].join(":");
                            this.dataDelHOTO[this.dataDelHOTO.length-1]["deleteDate"] = dD;
                        })
                        console.log(this.dataDelHOTO);
                        this.expandHOTO = this.expandHOTO == 0 ? null: 0;
                        });
                    } else {
                        this.expandHOTO = this.expandHOTO == 0 ? null: 0;
                    }
                } else if (this.tab == 1) {
                    if (!this.dataDelVR) {
                        const vRef = collection(db, 'deletedVouchers');
                        onSnapshot(vRef, (querySnapshot) => {
                        this.dataDelVR = [];
                        querySnapshot.docs.forEach((doc) => {
                            this.dataDelVR.push({ ...doc.data(), id: doc.id })
                            
                            var d = new Date(doc.data().date.seconds*1000);
                            d = [String(d.getDate()).padStart(2, '0'), String(d.getMonth()+1).padStart(2, '0'), String(d.getFullYear())].join("/") + " " + [String(d.getHours()).padStart(2, '0'), String(d.getMinutes()).padStart(2, '0')].join(":");
                            this.dataDelVR[this.dataDelVR.length-1]["datestamp"] = d;

                            var dD = new Date(doc.data().deleteDate.seconds*1000);
                            dD = [String(dD.getDate()).padStart(2, '0'), String(dD.getMonth()+1).padStart(2, '0'), String(dD.getFullYear())].join("/") + " " + [String(dD.getHours()).padStart(2, '0'), String(dD.getMinutes()).padStart(2, '0')].join(":");
                            this.dataDelVR[this.dataDelVR.length-1]["deleteDate"] = dD;
                        })
                        console.log(this.dataDelVR);
                        this.expandVR = this.expandVR == 0 ? null: 0;
                        });
                    } else {
                        this.expandVR = this.expandVR == 0 ? null: 0;
                    }
                } else if (this.tab == 2) {
                    if (!this.dataDelGames) {
                        const gRef = collection(db, 'deletedPrize');
                        onSnapshot(gRef, (querySnapshot) => {
                        this.dataDelGames = [];
                        querySnapshot.docs.forEach((doc) => {
                            this.dataDelGames.push({ ...doc.data(), id: doc.id })
                            
                            var d = new Date(doc.data().date.seconds*1000);
                            d = [String(d.getDate()).padStart(2, '0'), String(d.getMonth()+1).padStart(2, '0'), String(d.getFullYear())].join("/") + " " + [String(d.getHours()).padStart(2, '0'), String(d.getMinutes()).padStart(2, '0')].join(":");
                            this.dataDelGames[this.dataDelGames.length-1]["datestamp"] = d;

                            var dD = new Date(doc.data().deleteDate.seconds*1000);
                            dD = [String(dD.getDate()).padStart(2, '0'), String(dD.getMonth()+1).padStart(2, '0'), String(dD.getFullYear())].join("/") + " " + [String(dD.getHours()).padStart(2, '0'), String(dD.getMinutes()).padStart(2, '0')].join(":");
                            this.dataDelGames[this.dataDelGames.length-1]["deleteDate"] = dD;

                            if (doc.data().serialNum) {
                                this.dataDelGames[this.dataDelGames.length-1]["serialNum"] = (doc.data().serialNum).join(", ");
                            }

                            this.dataDelGames[this.dataDelGames.length-1]["prize"] = (doc.data().prize).join(", ");
                        })
                        console.log(this.dataDelGames);
                        this.expandGames = this.expandGames == 0 ? null: 0;
                        });
                    } else {
                        this.expandGames = this.expandGames == 0 ? null: 0;
                    }
                } else if (this.tab == 3) {
                    if (!this.dataDelLD) {
                        const lRef = collection(db, 'deletedRoadshow');
                        onSnapshot(lRef, (querySnapshot) => {
                        this.dataDelLD = [];
                        querySnapshot.docs.forEach((doc) => {
                            this.dataDelLD.push({ ...doc.data(), id: doc.id })
                            
                            var d = new Date(doc.data().date.seconds*1000);
                            d = [String(d.getDate()).padStart(2, '0'), String(d.getMonth()+1).padStart(2, '0'), String(d.getFullYear())].join("/") + " " + [String(d.getHours()).padStart(2, '0'), String(d.getMinutes()).padStart(2, '0')].join(":");
                            this.dataDelLD[this.dataDelLD.length-1]["datestamp"] = d;

                            var dD = new Date(doc.data().deleteDate.seconds*1000);
                            dD = [String(dD.getDate()).padStart(2, '0'), String(dD.getMonth()+1).padStart(2, '0'), String(dD.getFullYear())].join("/") + " " + [String(dD.getHours()).padStart(2, '0'), String(dD.getMinutes()).padStart(2, '0')].join(":");
                            this.dataDelLD[this.dataDelLD.length-1]["deleteDate"] = dD;
                        })
                        console.log(this.dataDelLD);
                        this.expandLD = this.expandLD == 0 ? null: 0;
                        });
                    } else {
                        this.expandLD = this.expandLD == 0 ? null: 0;
                    }
                }
            },
            //HOTO
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
                    if (!((Number(sArr[0]) >= 1901 && Number(sArr[0]) <= 2580) || (Number(sArr[0]) >= 2581 && Number(sArr[0]) <= 5880))) {
                        return false;
                    }
                } else {
                    for (var str of sArr) {
                        var range = str.split("-");
                        if (range.length == 1) {
                            if (!((Number(range[0]) >= 1901 && Number(range[0]) <= 2580) || (Number(range[0]) >= 2581 && Number(range[0]) <= 5880))) {
                                return false;
                            }
                        } else {
                            if (Number(range[1]) < Number(range[0])) {
                                return false;
                            } else {
                                if (!((Number(range[0]) >= 1901 && Number(range[1]) <= 2580) || (Number(range[0]) >= 2581 && Number(range[1]) <= 5880))) {
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
            editHOTO(item) {
                this.sNoStart = item.serialNumStart;
                this.sNoEnd = item.serialNumEnd;
                this.currHOTO = item;

                var sD = new Date(item.startTime.seconds*1000);
                sD = [String(sD.getFullYear()), String(sD.getMonth()+1).padStart(2, '0'), String(sD.getDate()).padStart(2, '0')].join("-") + "T" + [String(sD.getHours()).padStart(2, '0'), String(sD.getMinutes()).padStart(2, '0')].join(":");
                this.startTime = sD;

                var eD = new Date(item.endTime.seconds*1000);
                eD = [String(eD.getFullYear()), String(eD.getMonth()+1).padStart(2, '0'), String(eD.getDate()).padStart(2, '0')].join("-") + "T" + [String(eD.getHours()).padStart(2, '0'), String(eD.getMinutes()).padStart(2, '0')].join(":");
                this.endTime = eD;

                this.locationHOTO = item.location;

                this.dialogHOTO = true;
            },
            saveHOTO() {
                updateDoc(doc(db, 'hoto', this.currHOTO.id), {
                    location: this.locationHOTO,
                    serialNumStart: this.sNoStart.replaceAll(",", " ").trim(" ").split("  ").join(", "),
                    serialNumEnd: this.sNoEnd.replaceAll(",", " ").trim(" ").split("  ").join(", "),
                    startTime: firebase.firestore.Timestamp.fromDate(new Date(this.startTime)),
                    endTime: firebase.firestore.Timestamp.fromDate(new Date(this.endTime)),
                })
                .then((snapshot) => {
                    var colRef = collection(doc(db, 'hoto', this.currHOTO.id), "history");
                    addDoc(colRef, {
                        location: this.currHOTO.location,
                        serialNumStart: this.currHOTO.serialNumStart,
                        serialNumEnd: this.currHOTO.serialNumEnd,
                        startTime: this.currHOTO.startTime,
                        endTime: this.currHOTO.endTime,
                        email: this.currHOTO.email,
                        editDate: firebase.firestore.Timestamp.fromDate(new Date()),
                    })
                    .then((snapshot) => {
                        this.successList = [];
                        this.successList.push({ name: "Voucher Serial Number at the Start", value: this.sNoStart.replaceAll(",", " ").trim(" ").split("  ").join(", ") });
                        this.successList.push({ name: "Voucher Serial Number at the End", value: this.sNoEnd.replaceAll(",", " ").trim(" ").split("  ").join(", ") });
                        this.successList.push({ name: "Start Date", value: this.startTime.replace("T", " ") });
                        this.successList.push({ name: "End Date", value: this.endTime.replace("T", " ") });
                        this.successList.push({ name: "Location", value: this.locationHOTO });

                        this.dialogHOTO = false;
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
            deleteHOTO(item) {
                this.dialogDeleteHOTO = true;
                this.delHOTO = item;
            },
            deleteConfirmHOTO() {
                deleteDoc(doc(db, 'hoto', this.delHOTO.id), {
                })
                .then((snapshot) => {
                    addDoc(collection(db, "deletedHOTO"), {
                        location: this.delHOTO.location,
                        serialNumStart: this.delHOTO.serialNumStart,
                        serialNumEnd: this.delHOTO.serialNumEnd,
                        startTime: this.delHOTO.startTime,
                        endTime: this.delHOTO.endTime,
                        email: this.delHOTO.email,
                        deleteDate: firebase.firestore.Timestamp.fromDate(new Date()),
                    })
                    .then((snapshot) => {
                        this.successList = [];

                        this.dialogDeleteHOTO = false;
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

            //LD
            editLD(item) {
                this.nameLD = item.name;
                this.matricNoLD = item.matricNum;
                this.tele = item.telephone
                this.currLD = item;
                console.log(item.date)
                var d = new Date(item.date.seconds*1000);
                d = [String(d.getFullYear()), String(d.getMonth()+1).padStart(2, '0'), String(d.getDate()).padStart(2, '0')].join("-") + "T" + [String(d.getHours()).padStart(2, '0'), String(d.getMinutes()).padStart(2, '0')].join(":");
                this.dateLD = d;

                this.dialogLD = true;
            },
            saveLD() {
                this.saved = true;
                const lRef = doc(db, "roadshow", this.currLD.id);
                var toUp = {
                    name: this.nameLD,
                    telephone: this.tele,
                    date: firebase.firestore.Timestamp.fromDate(new Date(this.dateLD)),
                }
                if (this.matricNoLD && this.matricNoLD.length != 0) {
                    toUp['matricNum'] = this.matricNoLD
                } else {
                    toUp['matricNum'] = ""
                }

                var toAdd = {
                    name: this.currLD.name,
                    telephone: this.currLD.telephone,
                    date: this.currLD.date,
                    email: this.currLD.email,
                    editDate: firebase.firestore.Timestamp.fromDate(new Date()),
                }
                if (this.currLD.matricNum && this.currLD.matricNum.length != 0) {
                    toAdd['matricNum'] = this.currLD.matricNum
                }

                updateDoc(lRef, toUp)
                .then((snapshot) => {
                    var colRef = collection(doc(db, 'roadshow', this.currLD.id), "history");
                    addDoc(colRef, toAdd)
                    .then((snapshot) => {
                        var d = new Date(this.dateLD);
                        d = [String(d.getDate()).padStart(2, '0'), String(d.getMonth()+1).padStart(2, '0'), String(d.getFullYear())].join("/") + " " + [String(d.getHours()).padStart(2, '0'), String(d.getMinutes()).padStart(2, '0')].join(":");
                        
                        this.successList = [];
                        this.successList.push({ name: "Name", value: this.nameLD });
                        if (this.matricNoLD && this.matricNoLD.length != 0) {
                            this.successList.push({ name: "Matriculation Number", value: this.matricNoLD });
                        }
                        this.successList.push({ name: "Telephone", value: this.tele });
                        this.successList.push({ name: "Date", value: d });

                        this.dialogLD = false;
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
            deleteLD(item) {
                this.dialogDeleteLD = true;
                this.delLD = item;
            },
            deleteConfirmLD() {
                var toDel = {
                    name: this.delLD.name,
                    telephone: this.delLD.telephone,
                    date: this.delLD.date,
                    email: this.delLD.email,
                    deleteDate: firebase.firestore.Timestamp.fromDate(new Date()),
                }
                if (this.delLD && this.delLD.length != 0) {
                    toDel['matricNum'] = this.delLD.matricNum
                }

                deleteDoc(doc(db, 'roadshow', this.delLD.id), {
                })
                .then((snapshot) => {
                    addDoc(collection(db, "deletedRoadshow"), toDel)
                    .then((snapshot) => {
                        this.successList = [];

                        this.dialogDeleteLD = false;
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

            //VR
            editVR(item) {
                this.matricNoVR = item.matricNum;
                this.sNoVR = item.serialNum;
                this.currVR = item;
                this.locationVR = item.location;

                var d = new Date(item.date.seconds*1000);
                d = [String(d.getFullYear()), String(d.getMonth()+1).padStart(2, '0'), String(d.getDate()).padStart(2, '0')].join("-") + "T" + [String(d.getHours()).padStart(2, '0'), String(d.getMinutes()).padStart(2, '0')].join(":");
                this.dateVR = d;

                this.dialogVR = true;
            },
            saveVR() {
                this.saved = true;
                const vRef = doc(db, "vouchers", this.currVR.id);
                updateDoc(vRef, {
                    location: this.locationVR,
                    matricNum: this.matricNoVR,
                    serialNum: this.sNoVR,
                    date: firebase.firestore.Timestamp.fromDate(new Date(this.dateVR)),
                })
                .then((snapshot) => {
                    var colRef = collection(doc(db, 'vouchers', this.currVR.id), "history");
                    addDoc(colRef, {
                        serialNum: this.currVR.serialNum,
                        matricNum: this.currVR.matricNum,
                        location: this.currVR.location,
                        date: this.currVR.date,
                        email: this.currVR.email,
                        editDate: firebase.firestore.Timestamp.fromDate(new Date()),
                    })
                    .then((snapshot) => {
                        var d = new Date(this.dateVR);
                        d = [String(d.getDate()).padStart(2, '0'), String(d.getMonth()+1).padStart(2, '0'), String(d.getFullYear())].join("/") + " " + [String(d.getHours()).padStart(2, '0'), String(d.getMinutes()).padStart(2, '0')].join(":");
                        
                        this.successList = [];
                        this.successList.push({ name: "Voucher Serial Number", value: this.sNoVR });
                        this.successList.push({ name: "Matriculation Number", value: this.matricNoVR });
                        this.successList.push({ name: "Location", value: this.locationVR });
                        this.successList.push({ name: "Date", value: d });

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
            },
            deleteVR(item) {
                this.dialogDeleteVR = true;
                this.delVR = item;
            },
            deleteConfirmVR() {
                deleteDoc(doc(db, 'vouchers', this.delVR.id), {
                })
                .then((snapshot) => {
                    addDoc(collection(db, "deletedVouchers"), {
                        serialNum: this.delVR.serialNum,
                        matricNum: this.delVR.matricNum,
                        location: this.delVR.location,
                        date: this.delVR.date,
                        email: this.delVR.email,
                        deleteDate: firebase.firestore.Timestamp.fromDate(new Date()),
                    })
                    .then((snapshot) => {
                        this.successList = [];

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
            },

            //Games
            editGames(item) {
                this.name = item.name;
                this.matricNoGames = item.matricNum;
                this.prize = item.prize;
                this.sNoGames = item.serialNum;
                this.locationGames = item.location;
                this.currGames = item;

                var d = new Date(item.date.seconds*1000);
                d = [String(d.getFullYear()), String(d.getMonth()+1).padStart(2, '0'), String(d.getDate()).padStart(2, '0')].join("-") + "T" + [String(d.getHours()).padStart(2, '0'), String(d.getMinutes()).padStart(2, '0')].join(":");
                this.dateGames = d;

                this.sNosGames = (Array.from(Array(2581).keys()).slice(1901)).filter( ( sn ) => !this.voucherListGames.includes( sn ) || this.currGames.serialNum.includes( sn ));

                this.dialogGames = true;
            },
            saveGames() {
                this.saved = true;
                const gRef = doc(db, "prize", this.currGames.id);
                var toUp = {
                    name: this.name,
                    prize: this.prize,
                    location: this.locationGames,
                    date: firebase.firestore.Timestamp.fromDate(new Date(this.dateGames)),
                }
                if (this.matricNoGames && this.matricNoGames.length != 0) {
                    toUp['matricNum'] = this.matricNoGames
                } else {
                    toUp['matricNum'] = ""
                }
                if (this.prize.includes('PD23 voucher')) {
                    toUp['serialNum'] = this.sNoGames
                } else {
                    toUp['serialNum'] = ""
                }

                var toAdd = {
                    name: this.currGames.name,
                    prize: this.currGames.prize,
                    location: this.currGames.location,
                    date: this.currGames.date,
                    email: this.currGames.email,
                    editDate: firebase.firestore.Timestamp.fromDate(new Date()),
                }
                if (this.currGames.matricNum && this.currGames.matricNum.length != 0) {
                    toAdd['matricNum'] = this.currGames.matricNum
                }
                if (this.currGames.prize.includes('PD23 voucher')) {
                    toAdd['serialNum'] = this.currGames.serialNum
                }

                updateDoc(gRef, toUp)
                .then((snapshot) => {
                    var colRef = collection(doc(db, 'prize', this.currGames.id), "history");
                    addDoc(colRef, toAdd)
                    .then((snapshot) => {
                        var d = new Date(this.dateGames);
                        d = [String(d.getDate()).padStart(2, '0'), String(d.getMonth()+1).padStart(2, '0'), String(d.getFullYear())].join("/") + " " + [String(d.getHours()).padStart(2, '0'), String(d.getMinutes()).padStart(2, '0')].join(":");
                        
                        this.successList = [];
                        this.successList.push({ name: "Name", value: this.name });
                        if (this.matricNoGames && this.matricNoGames.length != 0) {
                            this.successList.push({ name: "Matriculation Number", value: this.matricNoGames });
                        }
                        this.successList.push({ name: "Prize", value: this.prize.join(", ") });
                        if (this.prize.includes('PD23 voucher')) {
                            this.successList.push({ name: "Voucher Serial Number", value: this.sNoGames.join(", ") });
                        }
                        this.successList.push({ name: "Location", value: this.locationGames });
                        this.successList.push({ name: "Date", value: d });

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
            },
            deleteGames(items) {
                this.dialogDeleteGames = true;
                this.delGames = items;
            },
            deleteConfirmGames() {
                var toDel = {
                    name: this.delGames.name,
                    prize: this.delGames.prize,
                    location: this.delGames.location,
                    date: this.delGames.date,
                    email: this.delGames.email,
                    deleteDate: firebase.firestore.Timestamp.fromDate(new Date()),
                }
                if (this.delGames && this.delGames.length != 0) {
                    toDel['matricNum'] = this.delGames.matricNum
                }
                if (this.delGames.prize.includes('PD23 voucher')) {
                    toDel['serialNum'] = this.delGames.serialNum
                }

                deleteDoc(doc(db, 'prize', this.delGames.id), {
                })
                .then((snapshot) => {
                    addDoc(collection(db, "deletedPrize"), toDel)
                    .then((snapshot) => {
                        this.successList = [];

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

            //History
            history(value) {
                if (!(this.dialogHOTO || this.dialogLD || this.dialogVR || this.dialogGames) && !(this.dialogDeleteHOTO || this.dialogDeleteLD || this.dialogDeleteVR || this.dialogDeleteGames)) {
                    this.dataEdit = [];
                    if (this.tab == 0) {
                        this.headersEdit = this.headersHOTO.slice(0, -1);
                        this.headersEdit.push({ text: 'Date of Edit', value: 'editDate' });
                        
                        getDocs(collection(doc(db, 'hoto', value.id), "history"))
                        .then((snapshot) => {
                            snapshot.docs.forEach((doc) => {
                                this.dataEdit.push({ ...doc.data(), id: doc.id })

                                var sD = new Date(doc.data().startTime.seconds*1000);
                                sD = [String(sD.getDate()).padStart(2, '0'), String(sD.getMonth()+1).padStart(2, '0'), String(sD.getFullYear())].join("/") + " " + [String(sD.getHours()).padStart(2, '0'), String(sD.getMinutes()).padStart(2, '0')].join(":");
                                this.dataEdit[this.dataEdit.length-1]["sDate"] = sD;

                                var eD = new Date(doc.data().endTime.seconds*1000);
                                eD = [String(eD.getDate()).padStart(2, '0'), String(eD.getMonth()+1).padStart(2, '0'), String(eD.getFullYear())].join("/") + " " + [String(eD.getHours()).padStart(2, '0'), String(eD.getMinutes()).padStart(2, '0')].join(":");
                                this.dataEdit[this.dataEdit.length-1]["eDate"] = eD;

                                var editD = new Date(doc.data().editDate.seconds*1000);
                                editD = [String(editD.getDate()).padStart(2, '0'), String(editD.getMonth()+1).padStart(2, '0'), String(editD.getFullYear())].join("/") + " " + [String(editD.getHours()).padStart(2, '0'), String(editD.getMinutes()).padStart(2, '0')].join(":");
                                this.dataEdit[this.dataEdit.length-1]["editDate"] = editD;
                            })
                        })
                        .catch(err => {
                            console.log(err);
                        })
                    } else if (this.tab == 1) {
                        this.headersEdit = this.headersVR.slice(0, -1);
                        this.headersEdit.push({ text: 'Date of Edit', value: 'editDate' });
                        
                        getDocs(collection(doc(db, 'vouchers', value.id), "history"))
                        .then((snapshot) => {
                            snapshot.docs.forEach((doc) => {
                                this.dataEdit.push({ ...doc.data(), id: doc.id })

                                var d = new Date(doc.data().date.seconds*1000);
                                d = [String(d.getDate()).padStart(2, '0'), String(d.getMonth()+1).padStart(2, '0'), String(d.getFullYear())].join("/") + " " + [String(d.getHours()).padStart(2, '0'), String(d.getMinutes()).padStart(2, '0')].join(":");
                                this.dataEdit[this.dataEdit.length-1]["datestamp"] = d;

                                var editD = new Date(doc.data().editDate.seconds*1000);
                                editD = [String(editD.getDate()).padStart(2, '0'), String(editD.getMonth()+1).padStart(2, '0'), String(editD.getFullYear())].join("/") + " " + [String(editD.getHours()).padStart(2, '0'), String(editD.getMinutes()).padStart(2, '0')].join(":");
                                this.dataEdit[this.dataEdit.length-1]["editDate"] = editD;
                            })
                        })
                        .catch(err => {
                            console.log(err);
                        })
                    } else if (this.tab == 2) {
                        this.headersEdit = this.headersGames.slice(0, -1);
                        this.headersEdit.push({ text: 'Date of Edit', value: 'editDate' });
                        
                        getDocs(collection(doc(db, 'prize', value.id), "history"))
                        .then((snapshot) => {
                            snapshot.docs.forEach((doc) => {
                                this.dataEdit.push({ ...doc.data(), id: doc.id })

                                var d = new Date(doc.data().date.seconds*1000);
                                d = [String(d.getDate()).padStart(2, '0'), String(d.getMonth()+1).padStart(2, '0'), String(d.getFullYear())].join("/") + " " + [String(d.getHours()).padStart(2, '0'), String(d.getMinutes()).padStart(2, '0')].join(":");
                                this.dataEdit[this.dataEdit.length-1]["datestamp"] = d;

                                var editD = new Date(doc.data().editDate.seconds*1000);
                                editD = [String(editD.getDate()).padStart(2, '0'), String(editD.getMonth()+1).padStart(2, '0'), String(editD.getFullYear())].join("/") + " " + [String(editD.getHours()).padStart(2, '0'), String(editD.getMinutes()).padStart(2, '0')].join(":");
                                this.dataEdit[this.dataEdit.length-1]["editDate"] = editD;

                                if (doc.data().serialNum) {
                                    this.dataEdit[this.dataEdit.length-1]["sNos"] = (doc.data().serialNum).join(", ");
                                }

                                this.dataEdit[this.dataEdit.length-1]["prizes"] = (doc.data().prize).join(", ");
                            })
                        })
                        .catch(err => {
                            console.log(err);
                        })
                    } else if (this.tab == 3) {
                        this.headersEdit = this.headersLD.slice(0, -1);
                        this.headersEdit.push({ text: 'Date of Edit', value: 'editDate' });
                        
                        getDocs(collection(doc(db, 'roadshow', value.id), "history"))
                        .then((snapshot) => {
                            snapshot.docs.forEach((doc) => {
                                this.dataEdit.push({ ...doc.data(), id: doc.id })

                                var d = new Date(doc.data().date.seconds*1000);
                                d = [String(d.getDate()).padStart(2, '0'), String(d.getMonth()+1).padStart(2, '0'), String(d.getFullYear())].join("/") + " " + [String(d.getHours()).padStart(2, '0'), String(d.getMinutes()).padStart(2, '0')].join(":");
                                this.dataEdit[this.dataEdit.length-1]["datestamp"] = d;

                                var editD = new Date(doc.data().editDate.seconds*1000);
                                editD = [String(editD.getDate()).padStart(2, '0'), String(editD.getMonth()+1).padStart(2, '0'), String(editD.getFullYear())].join("/") + " " + [String(editD.getHours()).padStart(2, '0'), String(editD.getMinutes()).padStart(2, '0')].join(":");
                                this.dataEdit[this.dataEdit.length-1]["editDate"] = editD;
                            })
                        })
                        .catch(err => {
                            console.log(err);
                        })
                    }
                    this.dialogEdit = true;
                }
            }
        }
    };
</script>

<style lang="css" scoped>
    .box {
        width: 80%;
        margin: 5% auto 5% auto;
    }
    .v-expansion-panel-content>>> .v-expansion-panel-content__wrap {
        padding: 0 !important;
    }
    .v-icon.outlined {
        border: 1px solid currentColor;
        border-radius:50%;
        padding: 1px;
    }
    
</style>