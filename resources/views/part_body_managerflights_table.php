
<style media="screen" type="text/css">
    td {
        max-width: 100px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        border-bottom: 1px solid #e0e0eb;
    }

    .highligtred{
        background-color: red;
    }
    .highligtgreen{
        background-color: green;
    }

</style>

<div class="wrapper wrapper-content animated fadeInRight">
    <div class="row">
        <div class="col-lg-12">
            <div class="ibox float-e-margins">

                <div class="ibox-content">
                    <h2>Manage Your Flights</h2>
                    <div class="add_delete_toolbar" />
                    <table class=" table-striped table-bordered table-hover" id="userflighttable">
                        <thead>
                        <tr>
                            <th>Id</th>
                            <th>Serial Number</th>
                            <th>Latitude</th>
                            <th>Longitude</th>
                            <th>Fligthpath</th>
                            <th>Height</th>
                            <th>Temperature</th>
                            <th>Weather</th>
                            <th>Warning</th>
                            <th>Status</th>
                            <th>Date</th>
                        </tr>
                        </thead>
                        <tbody>
                            <!--Dynamically load data for datatable-->
                        </tbody>
                    </table>

                    <!-- Moddal form: create and edit -->
                    <div id="customForm">
                        <editor-field name="Id"></editor-field>
                        <editor-field name="serialnumber"></editor-field>
                        <editor-field name="latitude"></editor-field>
                        <editor-field name="longitude"></editor-field>
                        <editor-field name="fligthpath"></editor-field>
                        <editor-field name="height"></editor-field>
                        <editor-field name="temperature"></editor-field>
                        <editor-field name="weather"></editor-field>
                        <editor-field name="warning"></editor-field>
                        <editor-field name="status"></editor-field>
                        <editor-field name="updated_at"></editor-field>
                    </div>

                </div>
            </div>
        </div>
    </div>
</div>

