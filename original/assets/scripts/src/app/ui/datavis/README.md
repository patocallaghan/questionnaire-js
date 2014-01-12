#NZTE Data Visualisation - Map

##Components

* Infographic
* Pane
* Tooltip
* Filter
* Zoom Button
* Data

* * *

### Pane

The right hand side pane which appears on region and country views.

####Functionality

* Appears when a region/country is selected
* Content is dynamically created. For example:
    * Media Links
    * Region/Country Name
    * Should Expand/Collapse

####Events

#####Subscribes

`/map/pane/show`

Shows the Pane: Required data:

```
{
    areaData: data,
    mediaLinks: links
}
```

* `areaData`: the country/region object (got from `Data.getAreaData( regionId )`)
* `mediaLinks`: links to show in the pane

`/map/pane/show`

Hides the pane

#####Publishes

`/map/pane/expanded`

Fires when the pane is expanded from a collapsed view

`/map/pane/collapsed`

Fires when the pane is collapsed from an expanded view

* * *

###Tooltip (app/ui/tooltip/tooltip)

Shows and hides a tooltip on the map.

####Functionality

* Single Tooltip on the page.
* Content is dynamically created. For example for a country:
    * Country name
    * Sector Links
    * Country Profile link
* Has a close button to close the tooltip

####Events

#####Subscribes

`/tooltip/show`

Shows the tooltip. Required data:

```
{
    tooltipData: data,
    top: 1234
    left: 100
}
```

* `tooltipData`: data used to render the template for the tooltip content
* `top`: Top position of the tooltip
* `left`: Left position of the tooltip

* * *

###Filter (app/ui/map/filter)

Allows you to filter the market research and media articles by sector.

####Functionality

* Radio buttons are only shown on top-level view
* Expand/Collapse filter
* Informational tooltip
* Sub Level View
    * Shows text only view
    * Text is dynamic e.g. Showing 8 Industries in South America or Showing All
    * Only Market Research legend shown

####Events

#####Subscribes

`/map/filter/view/full`

Event to show the full version of the filter i.e. with radio buttons

`/map/filter/view/compact`

Event to show the compact version of the filter i.e. without radio buttons but with text description. Required Data:

```
{
    regionId: 'north-america`
}
```

* `regionId`: the region that is to be shown. You can use `Data.getAreaData( regionId )` to get data relating to a region
Publishes

`/map/filter/update`

Published when filter selection is updated. Publishes the following data:

```
{
    filter: 'agribusiness'
}
```

###Zoom Button (app/ui/datavis/zoom)

The zoom out button

####Functionality

* Should not show on default view
* Should show on region and country views
* On Region view it should trigger an event to bring you back to the default view
* On Country view it should trigger an event to bring you back to the region view
* Button text should dynamic to update to say "Back to world view" or "Back to Europe view"

####Events

#####Subscribes

`/map/button/show`

Shows the button

`/map/button/hide`

Hides the button

#####Publishes

`/map/zoom/default`

Publishes this event when map should be brought back to default zoomed view

`/map/zoom/region`

Publishes this event when map should be brought back to a region view e.g. from Belgium to Europe

###Data (app/ui/datavis/data)

A utilitiy module which provides access to the JSON object containing all the region and country information. See some sample JSON at /scripts/src/app/ui/app/datavis/geo/test-data.json

####Public methods

`getAreaData( areaId, regionId (optional) )`: pass it a region or country id and it will return the corresponding data object. For example, trying to retrieve 'belgium' will return

```
{
    "id": "belgium",
    "name": "Belgium",
    "url": "http://www.nzte.govt.nz/en/export/export-markets/europe/belgium",
    "coordinates": {
        "lat": 50.54,
        "lon": 4.87
    },
    "zoom": {
        "depth": 2,
        "level": 17,
        "translateX": -1200,
        "translateY": -1550
    },
    "marketResearch": 5,
    "sectors": [
        {
            "title": "Agribusiness",
            "url": "http://www.nzte.govt.nz/en/export/export-markets/north-america/mexico/"
        },
        {
            "title": "Health",
            "url": "http://www.nzte.govt.nz/en/export/export-markets/north-america/mexico/"
        },
        {
            "title": "Food & Beverage",
            "url": "http://www.nzte.govt.nz/en/export/export-markets/north-america/mexico/"
        }
    ]
}
```

* `getAreaData( 'europe' )` - will the return the 'europe' object
* `getAreaData( 'belgium' )` - will the return the 'belgium' object
* `getAreaData( 'belgium', 'europe' )` - will the return the 'belgium' object but is more efficient than above as it first filters by region

